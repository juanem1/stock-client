<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/products"><v-icon>arrow_back</v-icon></v-btn>
      Editar producto
    </p>
    <v-layout>
      <v-flex>
        <v-progress-circular v-if="formLoading" :size="50" indeterminate color="primary"></v-progress-circular>
        <v-form v-if="!formLoading" ref="form" lazy-validation>
          <v-text-field box v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
          <v-autocomplete box :items="providers" :search-input.sync="searchProviders" :return-object="true" v-model="form.provider" label="Proveedor" item-text="name" item-value="id" required></v-autocomplete>
          <v-autocomplete box :loading="unitsLoading" :items="units" v-model="form.unit_id" label="Unidad" item-text="type" item-value="id" required></v-autocomplete>
          <v-text-field box v-model="form.description" label="Descripción (opcional)"></v-text-field>
          <!--v-btn class="ml-0" color="error" :loading="removeBtnLoading" @click="showConfirmation">Eliminar</v-btn-->
          <v-btn class="ml-0" color="success" :loading="btnLoading" :disabled="btnLoading" @click="onSubmit">Guardar cambios</v-btn>
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
    name: 'edit-product',
    data: function () {
      return {
        form: {
          name: null,
          provider: null,
          description: null,
          unit_id: null
        },
        // Autocomplete providers
        providers: [],
        searchProviders: [],
        loadingProviders: false,
        units: [],
        rules: {
          name: [
            v => !!v || 'Ingrese un nombre'
          ]
        },
        formLoading: true,
        unitsLoading: true,
        btnLoading: false,
        removeBtnLoading: false,
        confirm: false
      }
    },
    watch: {
      searchProviders (val) {
        if (this.form.provider && val) {
          if (val === this.form.provider.name) return
        }
        val && this.findProviders(val)
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
        // Set the id of provider and unit
        this.form.provider_id = this.form.provider.id
        this.$http.patch(`/products/${this.$route.params.id}`, this.form)
          .then(() => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'Los cambios se guardaron con exito!'
            })
            this.$router.push('/l/products')
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
            message: 'El producto se elimino con exito!'
          })
          this.$router.push('/l/products')
        }, 1000)
      },
      showConfirmation () {
        this.confirm = true
      },
      findProviders (val) {
        this.loadingProviders = true
        this.$http.get(`/providers/search?q=${val}&searchType=combo`)
          .then(response => {
            this.providers = response.data
          })
          .catch(error => {
            console.log(error)
          })
          .then(() => {
            this.loadingProviders = false
          })
      }
    },
    mounted: function () {
      this.$http.get(`/products/${this.$route.params.id}`)
        .then(response => {
          this.form.name = response.data.name
          this.providers.push(response.data.provider)
          this.form.provider = response.data.provider
          this.form.unit_id = response.data.unit
          this.form.description = response.data.description
        })
        .catch(() => {
          this.$messages.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Error al cargar el producto seleccionado'
          })
        })
        .then(() => {
          this.formLoading = false
        })

      // Get all units
      this.$http.get('/units')
        .then(response => {
          this.units = response.data
        })
        .catch(() => {
          this.$messages.$emit('SHOW_MESSAGE', {
            color: 'error',
            message: 'Error al cargar las unidades disponibles'
          })
        })
        .then(() => {
          this.unitsLoading = false
        })
    }
  }
</script>
