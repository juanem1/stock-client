<template>
  <v-container class="pa-0">
    <p class="headline">Ultimos movimientos</p> 
    <v-data-table 
      :disable-initial-sort="true" 
      :headers="headers" 
      :items="items" 
      :loading="loading" 
      v-model="selectedRows"
      no-data-text="No hay ordenes para mostrar"
      select-all
      hide-actions 
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>
        <td class="text-xs-left">{{ props.item.user }}</td>
        <td class="text-xs-left">
          <v-chip :color="chipColor(props.item.action)" text-color="white" class="ma-0">
            <v-icon left>{{chipArrow(props.item.action)}}</v-icon>
            {{ props.item.action }}
          </v-chip>
        </td>
        <td class="text-xs-left">{{ props.item.date }}</td>
        <td class="text-xs-left">{{ props.item.provider }}</td>
        <td class="text-xs-left">{{ props.item.fromStore }}</td>
        <td class="text-xs-left">{{ props.item.toStore }}</td>
        <td class="justify-center layout px-0">
          <v-icon small @click="openModal(props.item)" class="mr-1">visibility</v-icon>
          <v-icon small @click="printItem(props.item.id)">print</v-icon>
        </td>
      </template>
    </v-data-table>
    <div class="mt-1">
      <v-btn :disabled="disabledVoucherBtn" @click="printAllVouchers" color="info" class="mx-0">
        Imprimir remitos <v-icon dark right>print</v-icon>
      </v-btn>
    </div>
    <v-fab-transition>
      <v-btn to="/l/stock/add" fixed dark bottom right fab color="red">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <order-details :open="showModal" :data="modalDetails" @close="showModal = false"></order-details>
  </v-container>
</template>

<script>
  import orderDetails from '../orderDetails/modal'
  import voucher from '../../voucher'
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
        selectedRows: [],
        items: [],
        loading: true,
        modalDetails: {},
        showModal: false
      }
    },
    components: {
      orderDetails
    },
    computed: {
      disabledVoucherBtn () {
        return this.selectedRows.length <= 0
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
      openModal (item) {
        this.modalDetails = item
        this.showModal = true
      },
      printAllVouchers () {
        let ids = this.selectedRows.map(el => el.id)
        voucher.open(this.$store.state.User.apiToken, ids.join('|'))
      },
      printItem (id) {
        voucher.open(this.$store.state.User.apiToken, id)
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

