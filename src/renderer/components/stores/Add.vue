<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stores"><v-icon>arrow_back</v-icon></v-btn>
      Agregar deposito
    </p>
    <v-layout>
      <v-flex>
        <v-form ref="form" :model="form" lazy-validation>
          <v-text-field v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
          <v-text-field v-model="form.description" :rules="rules.description" label="Descripcion" required></v-text-field>
          <v-btn class="ml-0" color="success" :loading="btnLoading" @click="onSubmit">Guardar</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
          this.$messages.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Todos los errores deben ser resueltos'
          })
          return
        }
        this.btnLoading = true
        this.$http.post('/stores', this.form)
          .then(response => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El deposito se guardo correctamente'
            })
            this.$router.push('/l/stores')
          })
          .catch(() => {
            this.$messages.$emit('SHOW_MESSAGE', {
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
