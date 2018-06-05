<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Agregar stock
    </p>
    <v-form>
      <v-layout row wrap>
        <v-flex class="pr-3" sm9>
          <v-select :loading="loadingProviders" :items="providers" v-model="form.provider" label="Proveedor" item-text="name" item-value="id" required></v-select>
        </v-flex>
        <v-flex sm3>
          <v-select :loading="loadingStores" :items="stores" v-model="form.store" label="Deposito" item-text="name" item-value="id" required></v-select>
        </v-flex>
        <!--v-flex class="pr-3" sm2>
          <v-select :items="invoiceTypes" v-model="form.invoiceType" label="Tipo de factura" single-line></v-select>
        </v-flex>
        <v-flex sm10>
          <v-text-field v-model="form.invoice" label="N de Factura" placeholder="0000-00000000" mask="####-########" required></v-text-field>
        </v-flex-->
        <v-flex d-flex sm12 v-for="(product, i) in form.products" :key="i">
          <v-layout row wrap>
            <v-flex class="pr-3" sm9>
              <v-select :items="productList" :hint="`${form.products[i].product.amount} disponibles`" persistent-hint :search-input.sync="searchProducts" v-model="form.products[i].product" label="Producto" item-text="name" item-value="id" autocomplete combobox required></v-select>
            </v-flex>
            <v-flex sm3>
              <v-text-field v-model="form.products[i].amount" label="Cantidad" mask="#######" required></v-text-field>
            </v-flex>  
          </v-layout>
        </v-flex>
      </v-layout>
      <v-btn color="success" :loading="btnLoading" @click="onSubmit">Guardar</v-btn>
      <v-btn color="info" @click="addProduct">Agregar producto
        <v-icon>add</v-icon>
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
  import EventBus from '../event-bus'
  export default {
    name: 'add-stock',
    data: function () {
      return {
        // invoiceTypes: ['A', 'B', 'C', 'R'],
        form: {
          provider: [],
          store: '',
          movement: 'increment',
          // invoiceType: 'A',
          // invoice: '',
          products: [
            {product: '', amount: ''}
          ]
        },
        rules: {
          provider: [() => this.searchProviders.length > 0 || 'Seleccione un proveedor'],
          store: [() => this.form.store.length > 0 || 'Seleccione un deposito']
        },
        loadingProviders: false,
        loadingStores: false,
        btnLoading: false,
        providers: [],
        productList: [],
        stores: [],
        searchProviders: [],
        searchProducts: []
      }
    },
    watch: {
      searchProviders (val) {
        // val && this.findProviders(val)
      },
      searchProducts (val) {
        val && this.findProducts(val)
      }
    },
    methods: {
      onSubmit () {
        this.btnLoading = true
        this.$http.post('/order/increment', this.form)
          .then(response => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El stock se agrego con éxito!'
            })
            this.$router.push('/l/stock/activity')
          })
          .catch(e => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'Por favor revise los errores del formulario'
            })
            console.log(e)
          })
          .then(() => {
            this.btnLoading = false
          })
      },
      addProduct () {
        this.form.products.push({product: '', amount: ''})
      },
      findProviders (q) {
        /* this.loadingProviders = true
        this.$http.get(`/providers/search&q=${q}&combo`)
          .then(response => {
            zthis.providers = response.data
          })
          .catch(error => {
            console.log(error)
          })
          .then(() => {
            this.loadingProviders = false
          }) */
      },
      findProducts (q) {
        // this.loadingProviders = true
        this.$http.get(`/products/search?q=${q}&fields=id,name,amount&provider=${this.form.provider}`)
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
      this.loadingProviders = true
      this.loadingStores = true
      this.$http.get('/providers')
        .then(response => {
          this.providers = response.data
        })
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          this.loadingProviders = false
        })

      this.$http.get('/stores')
        .then(response => {
          this.stores = response.data
        })
        .catch(error => {
          console.log(error)
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
