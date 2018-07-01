<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Configurar Endpoint URL</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="formEpt" v-model="endpointForm" lazy-validation>
                  <v-text-field v-model="url" :rules="rules.url" prepend-icon="cloud_upload" label="URL" placeholder="https://someweb.com" required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block :loading="loadingBtn" color="primary" @click="testEndpoint()">Provar y guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <messages></messages>
    </v-content>
  </v-app>
</template>

<script>
  import messages from './Messages'
  import cache from '../cache'

  export default {
    name: 'endpoint-page',
    data: function () {
      return {
        endpointForm: false,
        url: '',
        rules: {
          url: [
            v => !!v || 'Ingrese una direccion URL',
            v => /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/.test(v) || 'Ingrese una direccion valida'
          ]
        },
        loadingBtn: false
      }
    },
    components: {
      messages
    },
    methods: {
      testEndpoint: function () {
        if (!this.$refs.formEpt.validate()) {
          this.$messages.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Ingrese una URL valida'
          })
          return
        }
        this.loadingBtn = true
        const url = this.url.trim()
        this.$http.head(`${url}/ping`)
          .then(response => {
            // save endpoint as base url for all requests
            this.$http.defaults.baseURL = url
            // save endpoint as config
            cache.set('endpoint', url)
            // Redirect to login
            this.$router.push('/')
          })
          .catch(() => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'La direccion ingresada no es valida'
            })
          })
          .then(() => {
            this.loadingBtn = false
          })
      }
    }
  }
</script>
