<template>
  <v-container>
    <p class="headline">Ultimos movimientos</p> 
    <v-data-table :headers="headers" :items="items" :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.user }}</td>
        <td class="text-xs-left">
          <v-chip :color="chipColor(props.item.action)" text-color="white">
            <v-icon left>{{chipArrow(props.item.action)}}</v-icon>
            {{ props.item.action }}
          </v-chip>
        </td>
        <td class="text-xs-left">{{ props.item.provider }}</td>
        <td class="text-xs-left">{{ props.item.fromStore }}</td>
        <td class="text-xs-left">{{ props.item.toStore }}</td>
        <td class="text-xs-center">
          <v-menu bottom left>
            <v-btn icon class="mx-0" slot="activator">
              <v-icon color="grey">more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="showVoucher()">
                <v-list-tile-title>Imprimir remito</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>
    <v-fab-transition>
      <v-btn to="/l/stock/add" fixed dark bottom right fab color="red">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
  import Voucher from '../voucher'
  export default {
    name: 'activity-page',
    data: function () {
      return {
        headers: [
          { text: 'Usuario', value: 'user' },
          { text: 'Accion', value: 'action' },
          { text: 'Proveedor', value: 'provider' },
          { text: 'De deposito', value: 'fromStore' },
          { text: 'A deposito', value: 'toStore' },
          { text: '#', align: 'center', sortable: false }
        ],
        items: [],
        loading: true
      }
    },
    methods: {
      chipColor (action) {
        let colors = {
          Ingreso: 'green',
          Transferencia: 'blue',
          Salida: 'red'
        }
        return colors[action]
      },
      chipArrow (action) {
        let arrows = {
          Ingreso: 'arrow_upward',
          Transferencia: 'swap_horiz',
          Salida: 'arrow_downward'
        }
        return arrows[action]
      },
      showVoucher (id) {
        Voucher.open(this.$store.state.User.apiToken, id)
      }
    },
    mounted: function () {
      this.$http.get('/orders')
        .then(response => {
          this.items = response.data
        })
        .catch(error => {
          console.log(error)
        })
        .then(() => {
          this.loading = false
        })
    }
  }
</script>

<style>
</style>
