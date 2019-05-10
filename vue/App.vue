<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
a {
  text-decoration: none;
}
#app {
  font-family: PingFangSC-Regular,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  width: 100%;
  max-width: 750px;
  height: 100%;
  background: #f3f3f3;
  color: #343436;
}
.wrap-flex{
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.wrap-flex-item{
  flex: 1;
}
</style>
