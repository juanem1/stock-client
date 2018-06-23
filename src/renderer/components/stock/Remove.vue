<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Salida de stock
    </p>
    <v-form>
      <v-layout row wrap>
        <v-flex sm12>
          <v-select :loading="loadingStores" :items="stores" v-model="form.store" label="De deposito" item-text="name" item-value="id" required></v-select>
        </v-flex>
        <v-flex d-flex sm12 v-for="(product, i) in form.products" :key="i">
          <v-layout row wrap>
            <v-flex sm8 class="pr-3">
              <v-select :items="productList" :hint="availableMessage(i)" persistent-hint :search-input.sync="searchProducts" v-model="form.products[i].product" label="Producto" item-text="name" item-value="id" combobox required></v-select>
            </v-flex>
            <v-flex sm3>
              <v-text-field v-model="form.products[i].decrement" label="Cantidad" mask="#######" required></v-text-field>
            </v-flex>
            <v-flex sm1 class="text-xs-right" v-if="form.products.length > 1">
              <v-tooltip left>
                <v-btn slot="activator" @click="removeProduct(i)" icon>
                  <v-icon>clear</v-icon>
                </v-btn>
                <span>Quitar este producto</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-btn class="ml-0" color="success" :loading="btnLoading" @click="onSubmit">Guardar</v-btn>
      <v-btn color="info" @click="addProduct">Agregar producto
        <v-icon>add</v-icon>
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
  import EventBus from '../event-bus'
  import _ from 'lodash'
  export default {
    name: 'remove-stock',
    data: function () {
      return {
        form: {
          store: '',
          order_type: 2,
          products: [{product: '', decrement: ''}]
        },
        rules: {},
        loadingStores: false,
        btnLoading: false,
        stores: [],
        productList: [],
        searchProducts: []
      }
    },
    watch: {
      searchProducts (val) {
        val && this.findProducts(val)
      }
    },
    methods: {
      onSubmit () {
        this.btnLoading = true
        let formated = _.map(this.form.products, function (item) {
          return {
            amount: Number(item.decrement),
            id: item.product.id,
            name: item.product.name
            // inStock: item.product.amount
          }
        })
        let form = _.clone(this.form)
        form.products = formated

        this.$http.post('/orders', form)
          .then(response => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: response.data.message
            })
            this.$router.push('/l/stock/activity')
          })
          .catch(e => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: e.response.data.error.message
            })
          })
          .then(() => {
            this.btnLoading = false
          })
      },
      addProduct () {
        this.form.products.push({product: '', decrement: ''})
      },
      removeProduct (i) {
        this.form.products.splice(i, 1)
      },
      availableMessage (i) {
        let amount = this.form.products[i].product.amount
        return `${amount || 0} disponibles`
      },
      findProducts (q) {
        this.$http.get(`/products/search?q=${q}&searchType=combo&store=${this.form.store}`)
          .then(response => {
            this.productList = response.data
          })
          .catch(error => {
            console.log(error)
          })
          .then(() => {
            this.loadingProviders = false
          })
      }
    },
    mounted: function () {
      this.loadingStores = true
      this.$http.get('/stores')
        .then(response => {
          this.stores = response.data
        })
        .catch(e => {
          EventBus.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Se produjo un error al intentar cargar los depositos'
          })
          console.log(e)
        })
        .then(() => {
          this.loadingStores = false
        })
    }
  }
</script>

<style>
  div:not(.input-goup--focused) .input-group--select__autocomplete {
    display: none;
  }
</style>
