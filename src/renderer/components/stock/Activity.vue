<template>
  <v-container>
    <p class="headline">Ultimos movimientos</p> 
    <v-data-table :disable-initial-sort="true" :headers="headers" :items="items" :loading="loading" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.user }}</td>
        <td class="text-xs-left">
          <v-chip :color="chipColor(props.item.action)" text-color="white">
            <v-icon left>{{chipArrow(props.item.action)}}</v-icon>
            {{ props.item.action }}
          </v-chip>
        </td>
        <td class="text-xs-left">{{ props.item.date }}</td>
        <td class="text-xs-left">{{ props.item.provider }}</td>
        <td class="text-xs-left">{{ props.item.fromStore }}</td>
        <td class="text-xs-left">{{ props.item.toStore }}</td>
        <td class="text-xs-center">
          <v-menu bottom left>
            <v-btn icon class="mx-0" slot="activator">
              <v-icon color="grey">more_vert</v-icon>
            </v-btn>
            <v-list>
              <!--v-list-tile @click="showVoucher(props.item)">
                <v-list-tile-title>Imprimir remito</v-list-tile-title>
              </v-list-tile-->
              <v-list-tile @click="showModal(props.item)">
                <v-list-tile-title>Ver orden</v-list-tile-title>
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
    <v-dialog v-model="isModalOpen" persistent max-width="60%">
      <v-card>
        <v-card-title class="headline">Orden de {{modalDetails.action}}</v-card-title>
        <v-card-text>
          <v-progress-linear v-if="loadingDetails" height="3" indeterminate color="primary"></v-progress-linear>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" outline @click.native="showVoucher(modalDetails)">Imprimir remito</v-btn>
          <v-btn color="green darken-2" outline @click.native="isModalOpen = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          { text: 'Fecha', value: 'date' },
          { text: 'Proveedor', value: 'provider' },
          { text: 'De deposito', value: 'fromStore' },
          { text: 'A deposito', value: 'toStore' },
          { text: '#', align: 'center', sortable: false }
        ],
        items: [],
        loading: true,
        isModalOpen: false,
        loadingDetails: false,
        modalDetails: {}
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
      showVoucher (item) {
        Voucher.open(this.$store.state.User.apiToken, item.id)
      },
      showModal (item) {
        this.modalDetails = item
        this.loadingDetails = true
        this.isModalOpen = true
        this.$http.get(`/orders/${item.id}`)
          .then(response => {
            this.modalDetails = response
          })
          .then(response => {
            this.loadingDetails = false
          })
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

