<template>
  <v-snackbar :timeout="5000" top :color="snackbarColor" v-model="snackbar">
    {{ snackbarMessage }}
    <v-btn dark flat icon @click.native="snackbar = false">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  import Messages from '../messages'

  export default {
    name: 'messages',
    data: function () {
      return {
        snackbar: false,
        snackbarColor: '',
        snackbarMessage: ''
      }
    },
    mounted: function () {
      Messages.$on('SHOW_MESSAGE', (msg) => {
        this.snackbarColor = msg.color
        this.snackbarMessage = msg.message
        this.snackbar = true
      })
    }
  }
</script>