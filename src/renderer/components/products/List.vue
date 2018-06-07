<template>
  <div>
    <p class="headline">Productos</p>
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
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.provider }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">
          <v-btn icon class="mx-0" @click="editProduct(props.item.id)">
            <v-icon>edit</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-fab-transition>
      <v-btn to="/l/products/add" fixed dark bottom right fab color="red">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
  export default {
    name: 'stores-list',
    data: function () {
      return {
        headers: [
          { text: 'Nombre', value: 'name' },
          { text: 'Proveedor', value: 'provider' },
          { text: 'Descripcion', value: 'description' },
          { text: 'Acciones', value: '', sortable: false }
        ],
        items: [],
        form: {
          product: ''
        },
        loading: true
      }
    },
    methods: {
      editProduct (productId) {
        this.$router.push(`/l/products/${productId}/edit`)
      }
    },
    mounted: function () {
      this.$http.get(`/products`)
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
</script>
