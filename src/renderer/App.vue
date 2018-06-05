<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'stock'
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Helvetica Neue', sans-serif; }
  .el-main {
    padding: 0;
  }
  .el-container .el-header {
    border-bottom: 1px solid #e6e6e6;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    padding-top: 10px;
  }
  .el-container .content {
    padding: 20px;
  }
  .text-right {
    text-align: right;
  }
</style>
