<template>
  <div id="app">
    <HeartBeat />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HeartBeat from './components/HeartBeat.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HeartBeat
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
}
</style>
