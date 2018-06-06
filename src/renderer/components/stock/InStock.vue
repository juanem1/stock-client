<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Productos en existencia
    </p>
    <v-form ref="form" :model="form" class="mb-2" lazy-validation>
      <v-layout row wrap>
        <v-flex class="pr-3" sm10>
          <v-text-field prepend-icon="search" v-model="form.product" label="Buscar producto" class="elevation-1" solo required></v-text-field>
        </v-flex>
        <v-flex sm2>
          <v-btn block color="primary" @click="search">
            <v-icon>search</v-icon> Buscar
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-data-table :headers="headers" :loading="loading" :items="items" hide-actions class="elevation-1">
      <template slot="items" slot-scope="prod">
        <td class="text-xs-left">{{ prod.item.name }}</td>
        <td class="text-xs-left">{{ prod.item.provider.name }}</td>
        <td class="text-xs-left">{{ prod.item.store.name }}</td>
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
        this.items = []
        this.loading = true
        this.$http.get(`/products/search?q=${this.form.product}&relations`)
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
