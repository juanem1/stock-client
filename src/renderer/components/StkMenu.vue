<template>
  <v-list>
    <v-list-group>
      <v-list-tile slot="activator">
        <v-list-tile-action>
          <v-icon>local_shipping</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Stock</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/l/stock/add">
        <v-list-tile-content>
          <v-list-tile-title>Ingreso</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/l/stock/remove">
        <v-list-tile-content>
          <v-list-tile-title>Salida</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/l/stock/transfer">
        <v-list-tile-content>
          <v-list-tile-title>Transferencia</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/l/stock/in-stock">
        <v-list-tile-content>
          <v-list-tile-title>En existencia</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile to="/l/stock/activity">
        <v-list-tile-content>
          <v-list-tile-title>Actividad</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
    <v-divider></v-divider>
    <v-list-tile to="/l/products">
      <v-list-tile-action>
        <v-icon>local_offer</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Productos</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
    <v-list-tile to="/l/providers">
      <v-list-tile-action>
        <v-icon>people</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Proveedores</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
    <v-list-tile to="/l/stores">
      <v-list-tile-action>
        <v-icon>store</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Depositos</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
    <v-list-tile to="/l/config">
      <v-list-tile-action>
        <v-icon>settings</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Configuracion</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
  </v-list>
</template>

<script>
  export default {
    name: 'stk-menu',
    data: function () {
      return {}
    }
  }
</script>
