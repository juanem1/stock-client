<template>
  <v-container class="pa-0">
    <p class="headline">Depositos</p> 
    <v-data-table :headers="headers" :loading="loading" :items="items" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">
          <v-btn icon class="mx-0" @click="editStore(props.item.id)">
            <v-icon>edit</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-fab-transition>
      <v-btn to="/l/stores/add" fixed dark bottom right fab color="red">
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
          { text: 'Descripcion', value: 'description' },
          { text: 'Acciones', value: '', sortable: false }
        ],
        items: [],
        loading: true
      }
    },
    methods: {
      editStore (storeId) {
        this.$router.push(`/l/stores/${storeId}/edit`)
      }
    },
    mounted: function () {
      this.$http.get(`/stores`)
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
