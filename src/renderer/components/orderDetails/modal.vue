<template>
  <v-dialog v-model="open" max-width="60%" persistent>
    <v-card>
      <v-card-title v-if="!loading" class="headline grey lighten-2">
        Orden de {{details.orderType}}
      </v-card-title>
      <v-card-text>
        <div v-if="loading" style="text-align:center;">
          <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-if="!loading">
          <div v-if="details.orderType == 'Ingreso'">
            <p><strong>Proveedor:</strong> {{details.provider}} <br><strong>A deposito:</strong> {{details.toStore}}</p>
          </div>
          <div v-if="details.orderType == 'Salida'">
            <p><strong>De deposito:</strong> {{details.fromStore}}</p>
          </div>
          <div v-if="details.orderType == 'Transferencia'">
            <p><strong>De deposito:</strong> {{details.fromStore}} <br><strong>A deposito:</strong> {{details.toStore}}</p>
          </div>
          <v-card flat>
            <v-list dense>
              <template v-for="(item, index) in details.details">
                <v-list-tile>
                  <v-list-tile-content>{{item.product}}</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{item.amount}}</v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index + 1 < details.details.length" :key="`divider-${index}`"></v-divider>
              </template>
            </v-list>
          </v-card>
        </div>
      </v-card-text>
      <v-card-actions v-if="!loading">
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" outline @click.native="showVoucher(details)">Imprimir remito</v-btn>
        <v-btn color="green darken-2" outline @click.native="close()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import voucher from '../../voucher'
  export default {
    name: 'order-details',
    data: function () {
      return {
        details: {},
        loading: true
      }
    },
    props: ['data', 'open'],
    watch: {
      open () {
        if (!this.open) {
          return
        }
        this.loading = true
        this.$http.get(`/orders/${this.data.id}`)
          .then(response => {
            this.details = response.data
          })
          .then(response => {
            this.loading = false
          })
      }
    },
    methods: {
      close () {
        this.$emit('close')
      },
      showVoucher (item) {
        voucher.open(this.$store.state.User.apiToken, item.id)
      }
    }
  }
</script>

<style>
.v-card.v-card--flat {border: 1px solid rgba(0,0,0,.12);}
</style>