<template>
  <v-container>
    <p class="headline">
      <v-btn class="ml-0" flat icon to="/l/stock/activity"><v-icon>arrow_back</v-icon></v-btn>
      Transferencia de stock
    </p>
    <v-form>
      <v-layout row>
        <v-flex d-flex sm5>
          <v-select :items="fromStore" v-model="form.fromStore" label="De deposito" item-value="text" class="input-group--focused" single-line></v-select>
        </v-flex>
        <v-flex d-flex sm2>
          <v-icon>arrow_forward</v-icon>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex d-flex sm5>
          <v-select :items="toStore" v-model="form.toStore" label="A deposito" single-line></v-select>
        </v-flex>
      </v-layout>
      <v-text-field v-model="form.commodity" label="Producto" required></v-text-field>
      <v-text-field v-model="form.amount" label="Cantidad" required></v-text-field>
      <v-btn color="success" @click="onSubmit">Trasnferir</v-btn>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: 'add-stock',
    data: function () {
      return {
        fromStore: ['Deposito 1', 'Deposito 2'],
        toStore: ['Deposito 1', 'Deposito 2'],
        form: {
          commodity: '',
          amount: ''
        },
        rules: {
          commodity: [
            { required: true, message: 'Este campo es obligatorio', trigger: 'blur' }
            // ,{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: 'Este campo es obligatorio', trigger: 'blur' }
            // ,{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style>

</style>
