<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Transferencia de stock
    </p>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1" editable>Seleccionar deposito de origen y destino</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">Agregar productos a la orden</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-layout row wrap>
            <v-flex d-flex sm5>
              <v-select box :loading="loadingStores" :items="stores" :return-object="true" v-model="fromStore" label="De deposito" item-text="name" item-value="id"></v-select>
            </v-flex>
            <v-flex d-flex sm2>
              <v-icon>arrow_forward</v-icon>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex d-flex sm5>
              <v-select box :loading="loadingStores" :items="stores" :return-object="true" v-model="toStore" label="A deposito" item-text="name" item-value="id"></v-select>
            </v-flex>
          </v-layout>
          <v-btn class="ml-0" color="primary" @click="nextStep" :disabled="nextBtn">Siguiente <v-icon>arrow_forward</v-icon></v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-layout row wrap class="px-1">
            <v-flex sm8 class="pr-3">
              <v-autocomplete
                :items="productList" 
                :hint="availableMessage()" 
                :search-input.sync="searchProducts" 
                :return-object="true"
                v-model="product" 
                label="Producto" 
                item-text="name" 
                item-value="id" 
                box 
                persistent-hint 
                required>
              </v-autocomplete>
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
              no-data-text="No hay productos para mostrar"
              hide-actions 
              class="elevation-1 flex grey lighten-2">
              <template slot="items" slot-scope="prod">
                <td class="text-xs-left">{{ prod.item.fromStore }}</td>
                <td class="text-xs-left">{{ prod.item.toStore }}</td>
                <td class="text-xs-left">{{ prod.item.product }}</td>
                <td class="text-xs-left">{{ prod.item.amount }}</td>
                <td class="justify-center layout px-0">
                  <v-icon small @click="removeProduct(prod.item)">delete</v-icon>
                </td>
              </template>
            </v-data-table>
            <v-flex sm12 class="mt-3">
              <v-btn class="ml-0" color="success" :loading="submitLoading" :disabled="submitLoading || order.products < 1" @click="onSubmit">Trasnferir</v-btn>
            </v-flex>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
  // import _ from 'lodash'
  export default {
    name: 'add-stock',
    data: function () {
      return {
        step: 1,
        stores: [],
        // Form fields
        fromStore: null,
        toStore: null,
        product: null,
        amount: null,
        // Loaders
        loadingStores: true,
        submitLoading: false,
        searchProducts: [],
        productList: [],
        // Table
        headers: [
          { text: 'De deposito', value: 'fromStore', sortable: false },
          { text: 'A deposito', value: 'toStore', sortable: false },
          { text: 'Producto', value: 'product', sortable: false },
          { text: 'Cantidad', value: 'amount', sortable: false },
          { text: '#', align: 'center', sortable: false }
        ],
        // Only for display items in the table
        table: [],
        // Order to send
        order: {
          order_type: 3,
          products: []
        }
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
        if (this.product && val) {
          if (val === this.product.name) return
        }
        val && this.findProducts(val)
      }
    },
    methods: {
      onSubmit () {
        this.submitLoading = true
        this.$http.post('/orders', this.order)
          .then(response => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El stock se transfirio con éxito!'
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
            this.submitLoading = false
          })
      },
      availableMessage () {
        if (this.product !== null) {
          const amount = this.product.amount
          return `${amount || 0} disponibles`
        }
        return ''
      },
      addProduct () {
        // Add items to the order
        this.order.products.push({
          id: this.product.id,
          name: this.product.name,
          amount: this.amount
        })
        // Add items to the table
        this.table.push({
          fromStore: this.fromStore.name,
          toStore: this.toStore.name,
          product: this.product.name,
          amount: this.amount
        })
        // Reset product and amount
        this.product = null
        this.amount = null
      },
      removeProduct (item) {
        const index = this.table.indexOf(item)
        this.table.splice(index, 1)
        this.order.products.splice(index, 1)
      },
      nextStep () {
        this.order.fromStore = this.fromStore.id
        this.order.toStore = this.toStore.id
        this.step = 2
      },
      findProducts (q) {
        this.$http.get(`/products/search?q=${q}&searchType=combo&store=${this.fromStore.id}`)
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
          this.stores = response.data
        })
        .catch(e => {
          this.$messages.$emit('SHOW_MESSAGE', {
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

<style>
  thead {
    background-color: #e0e0e0!important;
    border-color: #e0e0e0!important;
  }
</style>