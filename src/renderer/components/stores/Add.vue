<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stores"><v-icon>arrow_back</v-icon></v-btn>
      Agregar deposito
    </p>
    <v-layout>
      <v-flex>
        <v-form ref="form" :model="form" lazy-validation>
          <v-text-field v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
          <v-text-field v-model="form.description" :rules="rules.description" label="Descripcion" required></v-text-field>
          <v-btn color="success" :loading="btnLoading" @click="onSubmit">Guardar</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EventBus from '../event-bus'
  export default {
    name: 'add-store',
    data: function () {
      return {
        form: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            v => !!v || 'El nombre del deposito es obligatorio'
          ],
          description: [
            v => !!v || 'La descripcion del deposito es obligatoria'
          ]
        },
        btnLoading: false
      }
    },
    methods: {
      onSubmit () {
        if (!this.$refs.form.validate()) {
          EventBus.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Todos los errores deben ser resueltos'
          })
          return
        }
        this.btnLoading = true
        this.$http.post('/stores', this.form)
          .then(response => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El deposito se guardo correctamente'
            })
            this.$router.push('/l/stores')
          })
          .catch(() => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'Hubo un error al guardar los datos'
            })
          })
          .then(() => {
            this.btnLoading = false
          })
      }
    }
  }
</script>
