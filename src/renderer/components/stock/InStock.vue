<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Productos en existencia
    </p>
    <v-form class="mb-2" ref="form" :model="form" v-on:submit.prevent="search" lazy-validation>
      <v-layout row wrap>
        <v-flex class="pr-3" sm11>
          <v-text-field 
           box
            v-model="form.product"
            :rules="rules.product"
            label="Buscar producto"
            required>
          </v-text-field>
        </v-flex>
        <v-flex sm1 class="text-xs-center">
          <v-tooltip bottom>
            <v-btn fab :loading="loading" :disables="loading" slot="activator" color="info" class="ma-0" @click="search">
              <v-icon>search</v-icon>
            </v-btn>
            <span>Agregar producto</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-form>
    <v-data-table 
      :headers="headers" 
      :loading="loading" 
      :items="items" 
      no-data-text="No hay productos para mostrar"
      hide-actions 
      class="elevation-1">
      <template slot="items" slot-scope="prod">
        <td class="text-xs-left">{{ prod.item.product }}</td>
        <td class="text-xs-left">{{ prod.item.provider }}</td>
        <td class="text-xs-left">{{ prod.item.store }}</td>
        <td class="text-xs-left">{{ prod.item.amount }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    name: 'in-stock',
    data: function () {
      return {
        form: {
          product: ''
        },
        rules: {
          product: [v => !!v || 'Ingrese el nombre o parte del nombre de un producto']
        },
        loading: false,
        headers: [
          { text: 'Producto', value: 'name' },
          { text: 'Proveedor', value: 'provider' },
          { text: 'Deposito', value: 'store' },
          { text: 'En stock', value: 'amount' }
        ],
        items: []
      }
    },
    methods: {
      search: function () {
        if (!this.$refs.form.validate()) {
          return
        }
        this.items = []
        this.loading = true
        this.$http.get(`/products/search?q=${this.form.product}&searchType=inStock`)
          .then(response => {
            this.items = response.data
          })
          .catch(error => {
            this.message = error.response.data.errors.email + error.response.data.errors.password
          })
          .then(() => {
            this.loading = false
          })
      }
    }
  }
</script>

<style>
</style>
