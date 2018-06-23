<template>
  <v-container>
    <p class="headline">Productos</p>
    <v-form ref="form" :model="form" class="mb-2" v-on:submit.prevent="search" lazy-validation>
      <v-layout row wrap>
        <v-flex class="pr-3" sm10>
          <v-text-field 
            v-model="form.product" 
            label="Buscar producto" 
            :rules="rules.product"
            required>
          </v-text-field>
        </v-flex>
        <v-flex sm2>
          <v-btn block color="primary" @click="search">
            <v-icon>search</v-icon> Buscar
          </v-btn>
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
  </v-container>
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
        rules: {
          product: [v => !!v || 'Ingrese el nombre o parte del nombre de un producto']
        },
        loading: true
      }
    },
    methods: {
      editProduct (productId) {
        this.$router.push(`/l/products/${productId}/edit`)
      },
      search () {
        console.log()
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
