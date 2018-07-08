<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Agregar stock
    </p>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1" editable>Seleccionar deposito</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Agregar productos a la orden</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-select box :loading="loadingStores" :items="stores" :return-object="true" v-model="store" label="Deposito" item-text="name" item-value="id" required></v-select>
          <v-select box :loading="loadingProviders" :items="providers" :return-object="true" v-model="provider" label="Proveedor" item-text="name" item-value="id" required></v-select>
          <v-btn class="ml-0" color="primary" @click="nextStep" :disabled="nextBtn">Siguiente <v-icon>arrow_forward</v-icon></v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-layout row wrap class="px-1">
            <v-flex sm8 class="pr-3">
              <v-autocomplete box :items="productList" :return-object="true" :search-input.sync="searchProducts" v-model="product" label="Producto" item-text="name" item-value="id" required></v-autocomplete>
            </v-flex>
            <v-flex sm3>
              <v-text-field box v-model="amount" label="Cantidad" mask="#######" required></v-text-field>
            </v-flex>
            <v-flex sm1 class="text-xs-right">
              <v-tooltip bottom>
                <v-btn fab slot="activator" color="info" class="ma-0" @click="addProduct">
                  <v-icon>add</v-icon>
                </v-btn>
                <span>Agregar producto</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="px-1">
            <v-data-table 
              :headers="headers" 
              :items="table"
              :light="true"
              no-data-text="No hay productos para mostrar"
              hide-actions 
              class="elevation-1 flex grey lighten-2">
              <template slot="items" slot-scope="prod">
                <td class="text-xs-left">{{ prod.item.store }}</td>
                <td class="text-xs-left">{{ prod.item.provider }}</td>
                <td class="text-xs-left">{{ prod.item.product }}</td>
                <td class="text-xs-left">{{ prod.item.amount }}</td>
                <td class="justify-center layout px-0">
                  <v-icon small @click="removeProduct(prod.item)">delete</v-icon>
                </td>
              </template>
            </v-data-table>
            <v-flex sm12 class="mt-3">
              <v-btn class="ml-0" color="success" :loading="btnLoading" @click="onSubmit">Guardar</v-btn>
            </v-flex>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
  export default {
    name: 'add-stock',
    data: function () {
      return {
        step: 1,
        // Form
        store: null,
        provider: null,
        amount: null, // amount of product
        product: null, // amount of product
        // Table
        headers: [
          { text: 'Deposito', value: 'store', sortable: false },
          { text: 'Proveedor', value: 'provider', sortable: false },
          { text: 'Producto', value: 'product', sortable: false },
          { text: 'Cantidad', value: 'amount', sortable: false },
          { text: '#', align: 'center', sortable: false }
        ],
        // Only for display items in the table
        table: [],
        // Order to send
        order: {
          order_type: 1,
          provider: null,
          store: null,
          products: []
        },
        loadingProviders: false,
        loadingStores: false,
        btnLoading: false,
        providers: [],
        productList: [],
        stores: [],
        searchProducts: []
      }
    },
    computed: {
      nextBtn () {
        if (this.store !== null && this.provider !== null) {
          return false
        }
        return true
      }
    },
    watch: {
      searchProducts (val) {
        if (this.productList.length > 0) return
        val && this.findProducts(val)
      }
    },
    methods: {
      onSubmit () {
        this.btnLoading = true
        this.$http.post('/orders', this.order)
          .then(response => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El stock se agrego con éxito!'
            })
            this.$router.push('/l/stock/activity')
          })
          .catch(e => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'Por favor revise los errores del formulario'
            })
          })
          .then(() => {
            this.btnLoading = false
          })
      },
      addProduct () {
        if (this.product === null || this.amount === null) {
          this.$messages.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Seleccione un producto y una cantidad'
          })
          return
        }
        // Add items to the order
        this.order.products.push({
          id: this.product.id,
          name: this.product.name,
          amount: this.amount
        })
        // Add items to the table
        this.table.push({
          store: this.store.name,
          provider: this.provider.name,
          product: this.product.name,
          amount: this.amount
        })
        // Reset product and amount
        this.product = null
        this.amount = null
      },
      nextStep () {
        this.order.store = this.store.id
        this.order.provider = this.provider.id
        this.step = 2
      },
      removeProduct (item) {
        const index = this.table.indexOf(item)
        this.table.splice(index, 1)
        this.order.products.splice(index, 1)
      },
      findProducts (q) {
        // this.loadingProviders = true
        this.$http.get(`/products/search?q=${q}&searchType=combo`)
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
  thead {
    background-color: #e0e0e0!important;
    border-color: #e0e0e0!important;
  }
</style>
