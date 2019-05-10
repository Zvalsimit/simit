<template>
  <div>
    <h1>{{ index }}</h1>
    <child :state="index" :num="num" @page-go="readData"></child>
  </div>
</template>

<script>

import Page from './page'

export default {
  name: 'index',
  data () {
    return {
      index: 1,
      num: 43,
    }
  },
  components : {
    child : Page
  },
  methods : {
    /*
    * 修改当前页码
    */
    readData (p) {
      this.index = p.index
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
