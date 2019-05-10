<template>
  <div class="wrapper-container">
    <img :src="url"/>
    <canvas class="hide" id="myCanvas" width="750" height="1320"></canvas>
    <img class="hide" id="qrcode" :src="qrcode" @load="layerBefore"/>
    <img class="hide" id="myBg" src="../assets/img/canvas.png" @load="layerBefore"/>
  </div>
</template>
<script>
export default {
  name: 'entry',
  data () {
    return {
      userId: 0,
      index: 0,
      qrcode: null,
      url: null
    }
  },
  methods: {
    /*
    * loading
    */
    drawPhoto () {
      this.$vux.loading.show({
        text: '加载中'
      })
      this.init()
    },
    /*
    * 获取二维码URL
    */
    init () {
      this.request({
        url: '/v1/wx/mp/qr_code',
        type: 'get',
        data: {
          userId: this.userId,
          type: 1
        },
        success: res => {
          document.getElementById('qrcode').crossOrigin = ''
          this.qrcode = res.data
        },
        fail: res => {
        }
      })
    },
    /*
    * 判断图片加载完成
    */
    layerBefore (e) {
      this.index++
      if (this.index === 2) {
        this.layerCanvas()
      }
    },
    /*
    * 生成图片
    */
    layerCanvas () {
      let c = document.getElementById('myCanvas')
      let ctx = c.getContext('2d')
      let img = document.getElementById('myBg')
      let qrcode = document.getElementById('qrcode')
      ctx.drawImage(img, 0, 0, 750, 1320)
      ctx.drawImage(qrcode, 190, 850, 390, 390)
      this.url = c.toDataURL('image/png')
      this.$vux.loading.hide()
    }
  },
  created () {
    this.userId = this.$route.query.id || 0
    this.drawPhoto()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrapper-container{
  position: relative;
  width: 100%;
  min-height: 100%;
  padding: 0;
  box-sizing: border-box;
  background-size: cover;
}
.wrapper-container img{
  width: 100%;
  vertical-align: middle;
}
.hide{
  display: none;
}
</style>
