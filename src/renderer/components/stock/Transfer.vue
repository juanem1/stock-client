<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Transferencia de stock
    </p>
    <v-form ref="form" lazy-validation>
      <v-layout row wrap>
        <v-flex d-flex sm5>
          <v-select :loading="loadingStores" :items="fromStore" v-model="form.fromStore" label="De deposito" item-text="name" item-value="id"></v-select>
        </v-flex>
        <v-flex d-flex sm2>
          <v-icon>arrow_forward</v-icon>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex d-flex sm5>
          <v-select :loading="loadingStores" :items="toStore" v-model="form.toStore" label="A deposito" item-text="name" item-value="id"></v-select>
        </v-flex>
        <v-flex d-flex sm12 v-for="(product, i) in form.products" :key="i">
          <v-layout row wrap>
            <v-flex sm8 class="pr-3">
              <v-select 
                :items="productList" 
                :hint="availableMessage(i)" 
                :rules="rules.product" 
                :search-input.sync="searchProducts" 
                v-model="form.products[i].product" 
                label="Producto" 
                item-text="name" 
                item-value="id" 
                autocomplete 
                combobox 
                persistent-hint 
                required>
              </v-select>
            </v-flex>
            <v-flex sm3>
              <v-text-field 
                :rules="rules.amount" 
                v-model="form.products[i].amount" 
                label="Cantidad" 
                mask="#######" 
                required>
              </v-text-field>
            </v-flex>
            <v-flex sm1 class="text-xs-right">
              <v-tooltip left>
                <v-btn slot="activator" @click="removeProduct(i)" icon><v-icon>clear</v-icon></v-btn>
                <span>Quitar este producto</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-btn color="success" :loading="submitLoading" @click="onSubmit">Trasnferir</v-btn>
    </v-form>
  </v-container>
</template>

<script>
  import EventBus from '../event-bus'
  import _ from 'lodash'
  export default {
    name: 'add-stock',
    data: function () {
      return {
        fromStore: [],
        toStore: [],
        loadingStores: true,
        submitLoading: false,
        searchProducts: [],
        productList: [],
        form: {
          fromStore: '',
          toStore: '',
          order_type: 3,
          products: [{product: '', amount: ''}]
        },
        rules: {
          product: [
            v => !!v || 'Seleccione un producto'
          ],
          amount: [
            v => !!v || 'La cantidad es obligatoria'
          ]
        }
      }
    },
    watch: {
      searchProducts (val) {
        val && this.findProducts(val)
      }
    },
    methods: {
      onSubmit () {
        if (!this.$refs.form.validate()) {
          return
        }
        this.submitLoading = true
        let formated = _.map(this.form.products, function (item) {
          return {
            id: item.product.id,
            name: item.product.name,
            amount: Number(item.amount)
          }
        })
        let form = _.clone(this.form)
        form.products = formated
        this.$http.post('/orders', form)
          .then(response => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El stock se transfirio con éxito!'
            })
            this.$router.push('/l/stock/activity')
          })
          .catch(e => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'Por favor revise los errores del formulario'
            })
          })
          .then(() => {
            this.submitLoading = false
          })
      },
      availableMessage (i) {
        let amount = this.form.products[i].product.amount
        return `${amount || 0} disponibles`
      },
      removeProduct (i) {
        this.form.products.splice(i, 1)
      },
      findProducts (q) {
        this.$http.get(`/products/search?q=${q}&searchType=combo&store=${this.form.fromStore}`)
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
      this.$http.get('/stores')
        .then(response => {
          this.fromStore = response.data
          this.toStore = response.data
        })
        .catch(e => {
          EventBus.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Se produjo un error al intentar cargar los depositos'
          })
        })
        .then(() => {
          this.loadingStores = false
        })
    }
  }
</script>
