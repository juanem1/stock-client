<template>
  <div>
    <p class="headline">Proveedores</p> 
    <v-data-table :headers="headers" :items="items" :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">
          <v-btn icon class="mx-0" @click="editProvider(props.item.id)">
            <v-icon>edit</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>

    <v-fab-transition>
      <v-btn to="/l/providers/add" fixed dark bottom right fab color="red">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
  export default {
    name: 'providers-list',
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
      editProvider (providerId) {
        this.$router.push(`/l/providers/${providerId}/edit`)
      }
    },
    mounted: function () {
      this.$http.get('/providers')
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
