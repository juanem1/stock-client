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
        <v-tooltip bottom>
          <v-btn slot="activator" v-bind:class="{rotate: !drawer}" icon @click.native.stop="toggleDrawer">
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <span>{{hideMenuTooltip}}</span>
        </v-tooltip>
        <v-toolbar-title>{{company}}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <v-btn slot="activator" icon :disabled="updateDisabled" @click.native.stop="installUpdate()">
            <v-badge color="red" v-model="showBadge" left>
              <span slot="badge">!</span>
              <v-icon>update</v-icon>
            </v-badge>
          </v-btn>
          <span>Actualizar sistema</span>
        </v-tooltip>
        
        <v-tooltip bottom>
          <v-btn slot="activator" icon @click.native.stop="logout()">
            <v-icon>exit_to_app</v-icon>
          </v-btn>
          <span>Cerrar sesion</span>
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
  import cache from '../cache'
  
  export default {
    name: 'layout',
    data: function () {
      return {
        drawer: cache.has('drawer') ? cache.get('drawer') : true,
        userName: this.$store.state.User.name,
        company: this.$store.state.User.company,
        updateDisabled: true
      }
    },
    components: {stkMenu, messages},
    props: {
      source: String
    },
    computed: {
      showBadge () {
        return !this.updateDisabled
      },
      hideMenuTooltip () {
        return this.drawer ? 'Ocultar menu' : 'Mostrar menu'
      }
    },
    methods: {
      installUpdate () {
        this.$electron.ipcRenderer.send('quitAndInstall')
      },
      toggleDrawer () {
        this.drawer = !this.drawer
        cache.set('drawer', this.drawer)
      },
      logout () {
        this.$store.commit('DELETE_USER')
        this.$http.defaults.headers.common = {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': ''
        }
        this.$router.push('/')
      }
    },
    mounted: function () {
      if (this.$store.state.User.apiToken == null) {
        this.$router.push('/')
      }
      // If there is a new update
      this.$electron.ipcRenderer.on('updateReady', (event, data) => {
        this.updateDisabled = false
      })
    }
  }
</script>

<style>
.rotate {
  transform:rotate(180deg);
}
</style>
