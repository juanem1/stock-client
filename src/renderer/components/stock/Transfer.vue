<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Transferencia de stock
    </p>
    <v-form>
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
              <v-select :items="productList" :hint="availableMessage(i)" persistent-hint :search-input.sync="searchProducts" v-model="form.products[i].product" label="Producto" item-text="name" item-value="id" autocomplete combobox required></v-select>
            </v-flex>
            <v-flex sm3>
              <v-text-field v-model="form.products[i].amount" label="Cantidad" mask="#######" required></v-text-field>
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
      <v-btn color="success" @click="onSubmit">Trasnferir</v-btn>
    </v-form>
  </v-container>
</template>

<script>
  import EventBus from '../event-bus'
  export default {
    name: 'add-stock',
    data: function () {
      return {
        fromStore: ['Deposito 1', 'Deposito 2'],
        toStore: ['Deposito 1', 'Deposito 2'],
        loadingStores: true,
        searchProducts: [],
        productList: [],
        form: {
          fromStore: '',
          toStore: '',
          products: [{product: '', amount: ''}]
        },
        rules: {
          commodity: [
            { required: true, message: 'Este campo es obligatorio', trigger: 'blur' }
            // ,{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: 'Este campo es obligatorio', trigger: 'blur' }
            // ,{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
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
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
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

<style>

</style>
