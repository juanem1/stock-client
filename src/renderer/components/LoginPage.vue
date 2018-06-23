<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" :model="form" lazy-validation>
                  <v-text-field v-model="form.email" :rules="rules.email" prepend-icon="person" label="Email" required></v-text-field>
                  <v-text-field v-model="form.password" :rules="rules.password" prepend-icon="lock" label="Password" type="password" required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn block :loading="btnLoading" color="primary" @click="onSubmit">Login</v-btn>
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
  import EventBus from './event-bus'
  import messages from './Messages'
  export default {
    name: 'login-page',
    data: function () {
      return {
        form: {
          email: 'cbosco@example.org',
          password: 'secret'
        },
        rules: {
          email: [
            v => !!v || 'E-mail is required',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
          ],
          password: [
            v => !!v || 'Ingrese una contraseña',
            v => v.length >= 6 || 'La contraseña debe ser de al menos 6 caracteres'
          ]
        },
        btnLoading: false
      }
    },
    components: {
      messages
    },
    methods: {
      onSubmit: function () {
        if (!this.$refs.form.validate()) {
          EventBus.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Todos los errores deben ser resueltos'
          })
          return
        }
        this.btnLoading = true
        this.$http.post('/login', this.form)
          .then(response => {
            // save user in the store
            this.$store.commit('SET_USER', response.data)
            // Set headers for next request
            this.$http.defaults.headers.common = {
              'X-Requested-With': 'XMLHttpRequest',
              'Authorization': `Bearer ${response.data.api_token}`
            }
            // Check for updates
            this.$electron.ipcRenderer.send('checkForUpdates')
            // Redirect to home page
            this.$router.push('/l/stock/activity')
          })
          .catch(error => {
            if (error.response.status === 401) {
              EventBus.$emit('SHOW_MESSAGE', {
                color: 'error',
                message: 'Usuario o contraseña incorrecto'
              })
            } else {
              EventBus.$emit('SHOW_MESSAGE', {
                color: 'error',
                message: 'Error al intentar loguarse, por favor intente en unos minutos'
              })
            }
          })
          .then(() => {
            this.btnLoading = false
          })
      }
    }
  }
</script>
