<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/providers"><v-icon>arrow_back</v-icon></v-btn>
      Editar Proveedor
    </p> 
    <v-layout>
      <v-flex>
        <v-progress-circular v-if="formLoading" :size="50" indeterminate color="primary"></v-progress-circular>
        <v-form v-if="!formLoading" ref="form" lazy-validation>
          <v-text-field v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
          <v-text-field v-model="form.description" label="Descripcion"></v-text-field>
          <!--v-btn class="ml-0" color="error" @click="remove">Eliminar</v-btn-->
          <v-btn class="ml-0" color="success" :loading="btnLoading" @click="onSubmit">Guardar cambios</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EventBus from '../event-bus'
  export default {
    name: 'edit-provider',
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
        this.$http.patch(`/providers/${this.$route.params.id}`, this.form)
          .then(() => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'Los cambios se guardaron con exito'
            })
            this.$router.push('/l/providers')
          })
          .catch(() => {
            EventBus.$emit('SHOW_MESSAGE', {
              color: 'error',
              message: 'Error al guardar los cambios'
            })
          })
          .then(() => {
            this.btnLoading = false
          })
      },
      remove () {
        // alert('eliminado')
      }
    },
    mounted: function () {
      this.$http.get(`/providers/${this.$route.params.id}`)
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
