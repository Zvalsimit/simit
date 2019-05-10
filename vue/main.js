// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import { request, vali, wxapi, loading } from './utils'
import { AlertPlugin, LoadingPlugin, ToastPlugin, ConfirmPlugin, WechatPlugin } from 'vux'
import './assets/font/iconfont.css'

Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(WechatPlugin)

Vue.prototype.request = request
Vue.prototype.wxapi = wxapi
Vue.prototype.vali = vali()
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.meta.type === 1 && !store.state.user) {
    loading.call(Vue, res => {
      store.commit('user', res)
      next()
    }, to.query.code || '')
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    this.request({
      url: '/v1/wx/mp/enable_js',
      type: 'get',
      data: {
        url: location.href.replace(/#.+/, '')
      },
      success: res => {
        Vue.wechat.config(this.vali.merge(res.data, {
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'chooseWXPay']
        }))
      }
    })
  }
})
