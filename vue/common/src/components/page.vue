<template>
  <div class="page_wrap">
    <a @click="back">上一页</a>
    <a v-for="i in pages" @click="go(i)" :class="{active:i===index}">{{i}}</a>
    <a @click="next">下一页</a>
  </div>
</template>

<script>
export default {
  name: 'page',
  props: ['state','num'],
  data () {
    return {
      size : 5,
      index : 1,
      page_size : 5
    }
  },
  methods: {
    go (i) {
      if(this.index === i) return;
      this.index = i;
      this.$emit('page-go',{index : this.index})
    },
    next () {
      if(this.index >= this.all_size) return;
      this.index ++;
      this.$emit('page-go',{index : this.index})
    },
    back () {
      if(this.index <= 1) return;
      this.index --;
      this.$emit('page-go',{index : this.index})
    },
  },
  watch : {
    state (o,n) {
      if(o===0) this.index = 0;
    }
  },
  computed: {
    all_size () {
      return Math.ceil(this.num/this.size)
    }, 
    min_size () {
      return Math.min(this.page_size,this.all_size)
    },
    pages () {
      let arr = [];
      if(this.index < this.min_size){
        for(let i = 1; i <= this.min_size; i ++){
          arr.push(i)
        }
      }else{
        let before = this.all_size - (this.index - Math.floor(this.page_size/2)) >= this.page_size?(this.index - Math.floor(this.page_size/2)):(this.all_size - 4),
        after = Math.min(this.index + Math.floor(this.page_size/2),this.all_size);
        for(let i = before;i <= after;i++){
          arr.push(i)
        }
      }
      return arr
    }
  }

}
</script>

<style scoped>
a {
  padding: 0 10px;
  color: #42b983;
  cursor: pointer;
}
.active{
  color: #494949;
}
</style>
