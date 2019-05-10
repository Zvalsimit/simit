<template>
  <div class="page_wrap">
    <a @click="back">上一页</a>
    <a v-for="i in pages" @click="go(i)" :class="{active:i === index}">{{i}}</a>
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
      pageSize : 5
    }
  },
  methods: {
    /*
    * 点击页面跳转
    */
    go (i) {
      if(this.index === i) return;
      this.index = i;
      this.$emit('page-go',{index : this.index})
    },
    /*
    * 下一页
    */
    next () {
      if(this.index >= this.allSize) return;
      this.index ++;
      this.$emit('page-go',{index : this.index})
    },
    /*
    * 上一页
    */
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
    /*
    * 显示页码条数
    */
    allSize () {
      return Math.ceil(this.num/this.size)
    },
    /*
    * 最大显示条数
    */
    minSize () {
      return Math.min(this.pageSize, this.allSize)
    },
    /*
    * 当前显示页码
    */
    pages () {
      let arr = [];
      if(this.index < this.minSize){
        for(let i = 1; i <= this.minSize; i ++){
          arr.push(i)
        }
      }else{
        let before = this.allSize - (this.index - Math.floor(this.pageSize/2)) >= this.pageSize?(this.index - Math.floor(this.pageSize/2)):(this.allSize - 4),
        after = Math.min(this.index + Math.floor(this.pageSize/2),this.allSize);
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
