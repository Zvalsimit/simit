import axios from 'axios'
import md5 from 'js-md5'
/**
* axios
* @params options         {object}
*         options.url     {string}   请求地址
*         options.urlType {number}   请求地址参数 0 1
*         options.type    {string}   请求方式
*         options.data    {object}   请求参数
*         options.success {function} 成功回调
*         options.fail    {function} 失败回调
*/
const request = function (options) {
  // options.url = `/caiyj${options.urlType ? '/exam' : '/fm'}${options.url}`
  options.url = `${options.urlType ? '/exam' : '/fm'}${options.url}`
  let headers = {
    'sign': md5(Object.keys(options.data).sort().map(e => `${e}=${options.data[e]}`).join('&'))
  }
  if (typeof options !== 'object' || !options.url) {
    alert('参数错误')
    return false
  }
  if (options.type === 'get' || options.type === 'delete') {
    options.data = {
      params: options.data,
      headers: headers
    }
  }
  axios[options.type](options.url, options.data, {headers: headers})
    .then(res => {
      callback(res.data, options.success || '', options.fail || '', this)
    })
    .catch(err => {
      alert(err)
    })
}
/**
* axios callback
* @params res    {object}     请求返回
* @params fn     {function}   成功回调
* @params fail   {function}   失败回调
* @params that   {object}     this实例
*/
const callback = (res, fn, fail, that) => {
  if (res.code === 2049) {
    reset()
  } else if (res.code !== 1000 && that && fail) {
    fail(res)
  } else if (fn) {
    fn(res)
  }
}
/**
* 登录验证
*/
const loading = function (fn, code) {
  request({
    url: '/v1/wx/mp/oauth2',
    type: 'get',
    data: {
      code: code// || 'qaz123321zaq${cyj}256'
    },
    success: res => {
      if (!res.data) {
        reset()
        return
      }
      fn(res.data)
    },
    fail: res => {
      if (res.code === 40029) {
        reset()
      }
    }
  })
}
/**
* 重新微信登录
*/
const reset = (params = '') => {
  request({
    url: '/v1/wx/mp/app_id',
    type: 'get',
    data: {},
    success: res => {
      location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.data}&redirect_uri=${encodeURIComponent(location.href + params)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    }
  })
}
/*
* 验证
*/
const vali = () => {
  return {
    /*
    * 为空验证
    */
    empty (d, msg, b) {
      if (!d) {
        this.$vux.toast.text((b ? '请' + b : '请输入') + msg)
        return false
      }
      return true
    },
    /*
    * 手机验证
    */
    tel (str) {
      var reg = /\d{11}/
      if (!str) {
        this.$vux.alert.show('请输入手机号')
        return false
      } else if (!reg.test(str)) {
        this.$vux.alert.show('手机号码格式错误')
        return false
      }
      return true
    },
    /*
    * 身份证
    */
    card (d, msg) {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!d) {
        this.$vux.alert.show('', '请输入' + msg)
        return false
      } else if (!reg.test(d)) {
        this.$vux.alert.show('', msg + '格式错误')
        return false
      }
      return true
    },
    /*
    * 日期限制
    */
    compare (a, b) {
      if (a && b && parseInt(a.split('-').join('')) > parseInt(b.split('-').join(''))) {
        this.$vux.alert.show('', '时间选择范围错误')
        return false
      }
      return true
    },
    /*
    * 中文
    */
    noWord (str, msg) {
      let reg = /[\u4e00-\u9fa5]/
      if (!str) {
        this.$vux.alert.show('', '请输入' + msg)
        return false
      } else if (reg.test(str)) {
        this.$vux.alert.show('', msg + '格式错误')
        return false
      }
      return true
    },
    /*
    * 合并
    */
    merge (tar) {
      let mergeArr = Array.prototype.slice.call(arguments, 1)
      mergeArr.forEach(e => {
        for (let key in e) {
          if (!tar.hasOwnProperty(key)) {
            tar[key] = e[key]
          }
        }
      })
      return tar
    },
    // 查找索引
    getIndex (tar, item, key) {
      return tar.findIndex(e => e[key] === item)
    },
    /*
    * 获取URL参数
    * return {Array} [params: x]
    */
    getSearch () {
      let search = decodeURI(document.location.search)
      return search.replace(/(^\?)/, '').split('&').reduce(function (result, item) {
        let values = item.split('=')
        result[values[0]] = values[1]
        return result
      }, {})
    },
    /*
    * 日期
    * return {number} s
    */
    getDate () {
      let date = new Date()
      return Math.round(date.getTime() / 1000)
    },
    /*
    * 日期
    * return {string} yyyymmddhhmmss
    */
    getTime () {
      let date = new Date()
      let month = this.double(date.getMonth() + 1)
      let day = this.double(date.getDate())
      let hour = this.double(date.getHours())
      let minute = this.double(date.getMinutes())
      let second = this.double(date.getSeconds())
      return date.getFullYear() + '' + month + day + hour + minute + second
    },
    double (i) {
      return (i > 9 && i) || '0' + i
    }
  }
}
const wxapi = {
  /*
  * 获取微信sdk权限
  */
  config () {
    this.request({
      url: '/v1/wx/mp/enable_js',
      type: 'get',
      data: {
        url: location.href.replace(/#.+/, '')
      },
      success: res => {
        this.$wechat.config(this.vali.merge(res.data, {
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'chooseWXPay']
        }))
      }
    })
  },
  /*
  * 微信隐藏菜单
  */
  hideMenu () {
    this.$wechat.ready(() => {
      this.$wechat.hideAllNonBaseMenuItem()
    })
  },
  /*
  * 微信显示菜单
  */
  showMenu () {
    this.$wechat.ready(() => {
      this.$wechat.showAllNonBaseMenuItem()
    })
  },
  /*
  * 微信分享
  * @params title {string} 分享标题
  * @params des   {string} 分享描述
  * @params link  {string} 分享链接
  * @params image {string} 分享图标
  */
  share (title, des, link, image = logo) {
    this.$wechat.ready(() => {
      this.$wechat.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: image,
        success: function () {
          // 设置成功
        }
      })
      this.$wechat.onMenuShareAppMessage({
        title: title,
        desc: des,
        link: link,
        imgUrl: image,
        success: function () {
          // 设置成功
        }
      })
    })
  },
  /*
  * 微信上传
  * @params fn {function} 成功回调
  * return  path       本地路径
  *         serverId   服务器ID
  */
  upload (fn) {
    if (!fn) {
      return false
    }
    this.$wechat.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.$wechat.uploadImage({
          localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: r => {
            fn(res.localIds[0], r.serverId)
          }
        })
      }
    })
  },

  /*
  * 微信支付
  * @params data {object}   支付参数
  * @params fn   {function} 支付回调
  */
  pay (data, fn, cancel) {
    this.$wechat.chooseWXPay({
      timestamp: data.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
      package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: data.paySign, // 支付签名
      success: function (res) {
        fn && fn(data.orderNo)
      },
      cancel: function () {
        cancel && cancel(data.orderNo)
      },
      fail: (res) => {
        this.$vux.alert.show(res.errMsg)
      }
    })
  }
}
// 默认分享图标
const logo = 'https://img.caiyj.cn/images/testLogo.png'

export {
  request,
  loading,
  wxapi,
  reset,
  vali
}
