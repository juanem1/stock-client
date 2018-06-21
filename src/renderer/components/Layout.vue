<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon color="primary">person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{userName}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <stkMenu></stkMenu>
    </v-navigation-drawer>
    <v-content>
      <v-toolbar color="primary" dark>
        <v-btn v-bind:class="{rotate: !drawer}" icon @click.native.stop="drawer = !drawer">
          <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-toolbar-title>{{company}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn slot="activator" to="/logout" icon><v-icon>exit_to_app</v-icon></v-btn>
          <span>Salir del sistema</span>
        </v-tooltip>
      </v-toolbar>
      <v-container>
        <v-layout>
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
      <messages></messages>
    </v-content>
  </v-app>
</template>

<script>
  import stkMenu from './StkMenu'
  import messages from './Messages'
  export default {
    name: 'layout',
    data: function () {
      return {
        drawer: null,
        userName: this.$store.state.User.name,
        company: this.$store.state.User.company
      }
    },
    components: {stkMenu, messages},
    props: {
      source: String
    },
    mounted: function () {
      if (this.$store.state.User.apiToken == null) {
        this.$router.push('/')
      }
    }
  }
</script>

<style>
.rotate {
  transform:rotate(180deg);
}
</style>
