<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/providers"><v-icon>arrow_back</v-icon></v-btn>
      Agregar proveedor
    </p>
    <v-layout>
      <v-flex>
        <v-form ref="form" :model="form" lazy-validation>
          <v-text-field box v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
          <v-text-field box v-model="form.description" :rules="rules.description" label="Descripcion" required></v-text-field>
          <v-btn class="ml-0" color="success" :loading="btnLoading" :disabled="btnLoading" @click="onSubmit">Guardar</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'add-provider',
    data: function () {
      return {
        form: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            v => !!v || 'El nombre del proveedor es obligatorio'
          ],
          description: [
            v => !!v || 'La descripcion del proveedor es obligatoria'
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
        this.$http.post(`/providers`, this.form)
          .then(response => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El proveedor se guardo correctamente'
            })
            this.$router.push('/l/providers')
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
