<template>
  <div class="wrapper-container">
    <div class="wrap-head">
      <x-progress :percent="percent" :show-cancel="false"></x-progress>
      <div class="head-title wrap-flex" v-if="num > -1">
        <span class="head-left wrap-flex-item">当前剩余：{{num}}天</span>
        <span class="head-right wrap-flex-item">总使用期限：{{count}}天</span>
      </div>
      <div class="head-title wrap-flex" v-else>
        <span class="head-left wrap-flex-item">当前剩余：已过期</span>
        <span class="head-right wrap-flex-item">总使用期限：{{count}}天</span>
      </div>
    </div>
    <tabs :type="type" :invite="invite" :list="list"></tabs>
    <div class="notice">
      <p class="title">期限规则</p>
      <p>1：每邀请一位好友成功关注财艺家公众号即获得90天使用期限</p>
      <p>2：每购买一次期限套餐即获得90天使用期限</p>
    </div>
  </div>
</template>
<script>
import tabs from './tabs.vue'
import { XProgress } from 'vux'
export default {
  name: 'share',
  data () {
    return {
      type: 2,
      invite: [],
      list: [],
      count: 0,
      num: 0
    }
  },
  computed: {
    /*
    * 剩余天数进度条
    */
    percent () {
      return Math.ceil(this.num / this.count * 100)
    }
  },
  methods: {
    /*
    * 获取邀请购买记录
    */
    init () {
      this.request({
        url: '/v1/mp/unlock/details',
        type: 'get',
        data: {
          uType: this.type
        },
        success: res => {
          this.count = res.data.sumDays
          this.num = res.data.remainingDays
          this.invite = res.data.invitedList
          this.list = res.data.tsDetailList
        },
        fail: res => {
        }
      })
    }
  },
  components: {
    XProgress,
    tabs
  },
  created () {
    let link = `https://${location.host}/entry?id=${this.$store.state.userId}`
    this.wxapi.config.call(this)
    this.wxapi.share.call(this, '分级分类考试必过宝', '这有一枚分级分类考试必过锦囊，请注意查收', link)
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper-container{
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 20px 20px 10px;
  box-sizing: border-box;
  background: #fff;
}
.weui-progress >>> .weui-progress__bar{
  height: 8px;
  border-radius: 4px;
  background: #FEE4DF;
  box-shadow:0 1px 5px 0 rgba(2,18,114,0.05);
}
.weui-progress >>> .weui-progress__inner-bar{
  border-radius: 4px;
  background: #F97761;
}
.head-title{
  font-size: 12px;
  color: #666;
  line-height: 36px;
}
.head-right{
  text-align: right;
}
.notice{
  font-size: 12px;
  line-height: 24px;
  color: #999;
}
.title{
  font-size: 13px;
  text-align: center;
}
</style>
