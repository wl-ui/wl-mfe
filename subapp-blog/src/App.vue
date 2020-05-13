<template>
  <div id="app">
    <div id="nav">
      <span @click="routerReplace('/')">思否</span>|
      <span @click="routerReplace('/juejin')">掘金</span>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  methods: {
    routerReplace(url) {
      this.$router.replace(url);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
