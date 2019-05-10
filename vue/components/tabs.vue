<template>
  <div class="wrapper">
    <div class="wrapper-tab">
      <div class="wrap-flex wrap-title">
        <span class="wrap-flex-item" :class="[nav === 0 && 'active' || '']" @click="changeNav(0)">邀请获得期限</span>
        <span class="wrap-flex-item" :class="[nav === 1 && 'active' || '']" @click="changeNav(1)">购买获得期限</span>
      </div>
      <div class="content" v-if="nav === 0">
        <div class="content-title">邀请纪录</div>
        <div class="content-body" v-if="invite.length">
          <div class="wrap-flex" v-for="item in invite" :key="item.nickname">
            <span class="img">
              <img :src="item.photo">
            </span>
            <span>{{item.nickname}}</span>
            <span>{{item.days}}</span>
            <span>{{item.createTime.substr(0, 10)}}</span>
          </div>
        </div>
        <div class="content-body empty" v-else>
          <span>暂无相关数据</span>
        </div>
        <button class="btn" @click="toShare">立即邀请</button>
      </div>
      <div class="content" v-else>
        <div class="content-title">购买纪录</div>
        <div class="content-body active" v-if="list.length">
          <div class="wrap-flex" v-for="item in list" :key="item.desc">
            <span>{{item.desc}}</span>
            <span>{{item.completionTime.substr(0, 10)}}</span>
          </div>
        </div>
        <div class="content-body empty" v-else>
          <span>暂无相关数据</span>
        </div>
        <button class="btn" @click="toPay">立即购买</button>
      </div>
    </div>
    <pay ref="pay" :type="type"></pay>
    <div class="fixed-wrap" :class="{'active': status}" @click="closeWrap">
      <div class="fixed-body">
        <img src="../assets/bg.png">
      </div>
    </div>
  </div>
</template>
<script>
import pay from './pay.vue'
export default {
  name: 'tabs',
  props: ['type', 'invite', 'list'],
  data () {
    return {
      nav: 0,
      status: false
    }
  },
  methods: {
    /*
    * tab切换
    */
    changeNav (i) {
      this.nav = i
    },
    /*
    * 分享提示弹框
    */
    toShare () {
      this.status = true
      setTimeout(this.closeWrap, 1500)
    },
    closeWrap () {
      this.status = false
    },
    /*
    * 支付
    */
    toPay () {
      this.$refs.pay.toShow()
    }
  },
  components: {
    pay
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper-tab{
  width: 100%;
  height: 370px;
  box-shadow:0 0 8px 2px rgba(0, 0, 0, 0.08);
  border-radius:10px;
  margin: 15px 0;
}
.wrap-title{
  font-size: 14px;
  height: 52px;
  line-height: 50px;
  text-align: center;
  color: #333;
  border-bottom: 1px solid #E5E5E5;
}
.wrap-title .wrap-flex-item{
  border-bottom: 2px solid transparent;
}
.wrap-title .wrap-flex-item.active{
  color: #EA554D;
  border-bottom: 2px solid #F97761;
}
.content{
  position: relative;
  height: calc(100% - 52px);
}
.content-title{
  font-size: 12px;
  line-height: 28px;
  color: #999;
  text-align: center;
  padding-top: 10px;
}
.content-body{
  font-size: 12px;
  color: #999;
  height: 224px;
  overflow: auto;
}
.empty{
  text-align: center;
}
.content-body .wrap-flex{
  padding: 8px 15px;
  justify-content: space-between;
  align-items: center;
}
.content-body.active .wrap-flex{
  padding: 8px 40px;
}
.content-body .wrap-flex span{
  width: 25%;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-body .wrap-flex span:last-child{
  width: 28%;
}
.content-body.active .wrap-flex span{
  width: auto;
}
.content-body .wrap-flex span:first-child,
.content-body .wrap-flex .img + span{
  font-size: 13px;
  color: #333;
}
.content-body .wrap-flex .img{
  width: 40px;
  height: 40px;
  border-radius:50%;
  overflow: hidden;
}
.content-body .wrap-flex .img img{
  width: 100%;
}
.btn{
  position: absolute;
  bottom: 12px;
  left: calc(50% - 65px);
  width:130px;
  height:37px;
  background:rgba(234,85,77,1);
  box-shadow:0 5px 8px 2px rgba(255,16,0,0.15);
  border-radius: 28px;
  color: #fff;
  font-size: 14px;
  border: none;
}
.fixed-wrap{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 20;
  display: none;
}
.fixed-wrap.active{
  display: block;
}
.fixed-body{
  width: 68%;
  height: 100%;
  margin: 0 auto;
}
.fixed-body img{
  width: 100%;
}
</style>
