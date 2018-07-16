<template>
  <v-container class="pa-0">
    <!-- cambio de contraseña -->
    <v-card>
      <v-toolbar color="primary" dark>
        <v-icon>update</v-icon>
        <v-toolbar-title>Actualizaciones</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div>Version actual del sistema: {{appVersion}}</div>
        <div v-if="message">Status: {{message}}</div>
      </v-card-text>
      <v-card-actions class="mt-3">
        <v-btn :disabled="disableCheckForUpdates" :loading="updatesLoading" class="white--text" color="grey" @click.stop="checkForUpdates">
          Buscar actualizaciones
        </v-btn>
        <v-btn :disabled="disableDownloadBtn" class="white--text" color="green" @click.stop="downloadUpdates">
          Descargar actualización
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import log from 'electron-log'
  export default {
    name: 'config',
    data: function () {
      return {
        appVersion: this.$electron.remote.app.getVersion(),
        message: '',
        update: null,
        updatesLoading: false,
        disableCheckForUpdates: false,
        disableDownloadBtn: false
      }
    },
    methods: {
      checkForUpdates () {
        this.$electron.ipcRenderer.send('checkForUpdates')
      },
      downloadUpdates () {
        let link = `https://github.com/juanem1/stock-client/releases/download/v${this.update.version}/${this.update.files[0].url}`
        this.$electron.shell.openExternal(link)
      }
    },
    mounted: function () {
      this.$electron.ipcRenderer.on('checking-for-update', () => {
        this.updatesLoading = true
        this.message = 'Buscando actualizaciones...'
      })
      this.$electron.ipcRenderer.on('update-available', (event, args) => {
        this.updatesLoading = false
        this.disableCheckForUpdates = true
        this.message = 'Nueva actualización disponible'
        this.update = args
        this.disableDownloadBtn = false
      })
      this.$electron.ipcRenderer.on('update-not-available', (event, args) => {
        this.updatesLoading = false
        this.disableCheckForUpdates = true
        this.message = 'No hay actualizaciones disponibles'
      })
      this.$electron.ipcRenderer.on('error', (event, error) => {
        this.updatesLoading = false
        this.disableCheckForUpdates = true
        this.status = 'Error buscando las actualizaciones'
        log.error(error)
      })
    }
  }
</script>
