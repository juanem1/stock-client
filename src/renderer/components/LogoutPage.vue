<template>
</template>

<script>
  export default {
    name: 'logout-page',
    data: function () {
      return {}
    },
    mounted: function () {
      this.$store.commit('DELETE_USER')
      this.$http.defaults.headers.common = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': ''
      }
      this.$router.push('/')
    }
  }
</script>

<style>
</style>
