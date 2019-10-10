<template>
  <div class="app">
    <nav class="m-2">
      <h4>Mining pool watch</h4>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  beforeMount(){
    this.$store.commit('getUserData')
  },
  mounted(){
    //for demo
    if(this.$store.state.userdata.length == 0) {
      this.$store.state.userdata = [
        {pool:'ethermine', address:'0xf78951298306d8E79e99F481d9A159B5f0D4BC2C'},
        {pool:'supportxmr', address:'44Tw1jLRvWwV5nH6hzmiMuVigDGA7nunTajRtoeuVGrFfZUU1K6uiF5RJ24NDcderDdMRwdixGwfJi7mzzFdVUdPCfJ5bbr'}
      ]
      this.$store.dispatch('getMinerData')  
    }
  }
}
</script>

<style lang="scss">
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #292E34;
}
</style>
