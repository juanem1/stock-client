<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stores"><v-icon>arrow_back</v-icon></v-btn>
      Editar deposito
    </p>
    <v-layout>
      <v-flex>
        <v-progress-circular v-if="formLoading" :size="50" indeterminate color="primary"></v-progress-circular>
        <v-form v-if="!formLoading" ref="form" lazy-validation>
          <v-text-field v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
          <v-text-field v-model="form.description" label="Descripcion"></v-text-field>
          <!--v-btn color="error" :loading="removeBtnLoading" @click="showConfirmation">Eliminar</v-btn-->
          <v-btn class="ml-0" color="success" :loading="btnLoading" @click="onSubmit">Guardar cambios</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-dialog v-model="confirm" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Seguro?</v-card-title>
        <v-card-text>Una vez eliminado "{{form.name}}" ya no se podra recuperar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-2" flat @click.native="confirm = false">Cancelar</v-btn>
          <v-btn color="green darken-1" flat @click.native="remove">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    name: 'edit-store',
    data: function () {
      return {
        form: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            v => !!v || 'Ingrese un nombre'
          ]
        },
        formLoading: true,
        btnLoading: false,
        removeBtnLoading: false,
        confirm: false
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
        this.$http.patch(`/stores/${this.$route.params.id}`, this.form)
          .then(() => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'Los cambios se guardaron con exito!'
            })
            this.$router.push('/l/stores')
          })
          .catch(() => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'Error al guardar los cambios'
            })
          })
          .then(() => {
            this.btnLoading = false
          })
      },
      remove () {
        this.removeBtnLoading = true
        this.confirm = false
        // ajax delete
        setTimeout(() => {
          this.$messages.$emit('SHOW_MESSAGE', {
            color: 'success',
            message: 'El deposito se elimino con exito!'
          })
          this.$router.push('/l/stores')
        }, 1000)
      },
      showConfirmation () {
        this.confirm = true
      }
    },
    mounted: function () {
      this.$http.get(`/stores/${this.$route.params.id}`)
        .then(response => {
          this.form.name = response.data.name
          this.form.description = response.data.description
        })
        .catch(error => {
          this.message = error.response.data.errors.email + error.response.data.errors.password
        })
        .then(() => {
          this.formLoading = false
        })
    }
  }
</script>
