<template>
  <div class="fixed-wrap" :class="{'active': status}" @click.self="closeWrap">
    <div class="fixed-body">
      <p class="fixed-title" v-if="title">{{title[type]}}</p>
      <div class="wrap-flex" v-if="list.length">
        <div class="wrap-flex-item" :class="[item.id === id ? 'active' : '']" v-for="item in list" :key="item.id" @click="select(item.id)">
          <p class="title">{{item.detail}}</p>
          <p class="money">
            ¥<span class="fsise-20">{{item.currentPrice}}</span>
          </p>
          <p class="old">¥{{item.originalPrice}}</p>
        </div>
      </div>
      <button class="btn" @click="toPay">立即支付</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pay',
  props: ['type'],
  data () {
    return {
      id: 0,
      list: [],
      title: {
        '1': '文章期限套餐',
        '2': '必过宝解锁套餐'
      },
      status: false
    }
  },
  methods: {
    init () {
      this.request({
        url: '/v1/mp/product',
        type: 'get',
        data: {
          type: this.type
        },
        success: res => {
          this.list = res.data
          this.id = this.list[0].id
        },
        fail: res => {
        }
      })
    },
    select (id) {
      this.id = id
    },
    toPay () {
      this.request({
        url: '/v1/mp/order/create',
        type: 'get',
        data: {
          productId: this.id
        },
        success: res => {
          this.wxapi.pay.call(this, res.data, this.payStatus, this.payCancel)
        },
        fail: res => {
        }
      })
    },
    payCancel (id) {
      this.request({
        url: '/v1/mp/ts/cancel',
        type: 'get',
        data: {
          orderNo: id
        },
        success: res => {
        },
        fail: res => {
        }
      })
    },
    payStatus (id) {
      this.request({
        url: '/v1/mp/ts/status',
        type: 'get',
        data: {
          orderNo: id
        },
        success: res => {
          this.paySucc(res.data)
        },
        fail: res => {
        }
      })
    },
    paySucc (i) {
      let title = i ? ((this.type === 1 && '支付成功') || '支付成功，您已解锁所有功能') : '正在充值，请稍等'
      this.$vux.toast.show({
        text: title,
        time: 1000,
        onHide: res => {
          if (i) {
            this.$router.go(-1)
          }
        }
      })
    },
    toShow () {
      this.status = true
    },
    closeWrap () {
      this.status = false
    }
  },
  created () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  position: absolute;
  width: 100%;
  height: 230px;
  text-align: center;
  bottom: 0;
  padding: 0 10px;
  box-sizing: border-box;
  background: #fff;
}
.fixed-body p.fixed-title{
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.wrap-flex{
  justify-content: center;
}
.wrap-flex-item{
  max-width: 33%;
  height: 110px;
  border:1px solid rgba(237,237,237,1);
  border-radius: 1px;
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  align-content: space-around;
  padding: 10px 0;
}
.wrap-flex-item p{
  width: 100%;
}
.wrap-flex-item.active{
  background:rgba(255,248,242,1);
  border:1px solid rgba(227,131,97,1);
}
.wrap-flex-item + .wrap-flex-item{
  margin-left: 8px;
}
.title{

}
.money{
  color: #A57459;
  font-weight: bold;
}
.old{
  font-size: 12px;
  line-height: 18px;
  text-decoration: line-through;
}
.fsise-20{
  font-size: 20px;
}
.btn{
  width: 100%;
  height: 36px;
  background:rgba(234,85,77,1);
  border-radius:2px;
  border: none;
  color: #fff;
  font-size: 14px;
  margin-top: 24px;
}
</style>
