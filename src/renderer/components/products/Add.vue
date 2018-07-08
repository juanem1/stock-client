<template>
  <v-container class="pa-0">
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/products"><v-icon>arrow_back</v-icon></v-btn>
      Agregar producto
    </p>
    <v-layout>
      <v-flex>
        <v-form ref="form" lazy-validation>
          <v-text-field box v-model="form.name" label="Nombre" required></v-text-field>
          <v-autocomplete box :items="providers" :search-input.sync="searchProviders" :return-object="true" v-model="form.provider" label="Proveedor" item-text="name" item-value="id" required></v-autocomplete>
          <v-autocomplete box :items="units" :loading="unitsLoading" v-model="form.unit_id" label="Unidad" item-text="type" item-value="id" required></v-autocomplete>
          <v-text-field box v-model="form.description" label="Descripción (opcional)" required></v-text-field>
          <v-btn class="ml-0" color="success" :loading="btnLoading" :disabled="btnLoading" @click="onSubmit">Guardar</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'add-product',
    data: function () {
      return {
        form: {
          name: null,
          provider: null,
          description: null,
          unit_id: null
        },
        rules: {
          name: [v => !!v || 'El nombre del deposito es obligatorio'],
          provider: [v => !!v || 'El nombre del proveedor es obligatorio'],
          description: [v => !!v || 'La descripcion del deposito es obligatoria']
        },
        units: [],
        // Autocomplete providers
        providers: [],
        searchProviders: [],
        loadingProviders: false,
        unitsLoading: true,
        btnLoading: false
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
        // this.form.unit_id = this.form.unit.id
        this.$http.post('/products', this.form)
          .then(response => {
            this.$messages.$emit('SHOW_MESSAGE', {
              color: 'success',
              message: 'El producto se guardo correctamente'
            })
            this.$router.push('/l/products')
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
