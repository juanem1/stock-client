<template>
  <v-dialog v-model="isOpen" persistent max-width="60%">
    <v-card>
      <v-card-title class="headline">Orden de {{orderType}}</v-card-title>
      <v-card-text>
        <v-progress-linear v-if="loading" height="3" indeterminate color="primary"></v-progress-linear>
        <div v-if="!loading">{{details}}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" outline @click.native="showVoucher(details)">Imprimir remito</v-btn>
        <v-btn color="green darken-2" outline @click.native="isOpen = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Voucher from '../voucher'
  export default {
    name: 'order-details',
    data: function () {
      return {
        details: {},
        loading: true,
        isOpen: false
      }
    },
    props: ['data'],
    watch: {
      data (item) {
        this.loading = true
        this.isOpen = true
        this.details = item
        this.$http.get(`/orders/${item.id}`)
          .then(response => {
            this.details = response.data
          })
          .then(response => {
            this.loading = false
          })
      }
    },
    computed: {
      orderType () {
        const types = {
          1: 'Ingreso',
          2: 'Salida',
          3: 'Transferencia'
        }
        return types[this.details.order_type_id]
      }
    },
    methods: {
      showVoucher (item) {
        Voucher.open(this.$store.state.User.apiToken, item.id)
      }
    }
  }
</script>
