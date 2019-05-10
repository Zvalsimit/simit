const config = require('../config')
const SHA1 = require('./sha1')
const Qs = require('./qs')
/**
 * 拓展对象
 */
const extend = function extend(target) {
  let sources = [...arguments]
  for (let i = 0; i < sources.length; i += 1) {
    let source = sources[i];
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

const noop = function noop() { };

/**
 * 异常处理
 * 表示请求过程中发生的异常
 */
const RequestError = (function () {
  function RequestError(message) {
    Error.call(this, message);
    this.message = message;
  }
  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;
  return RequestError;
})();

/**
 * 默认参数
 * Url  请求 URL
 * V    接口版本
 * isSign 是否签名 (某些特定接口需要签名 true | false)
 * method 请求方式
 */
let defaultOptions = {
  url: config.host,
  v: config.conf.V,
  v2: config.conf.V2,
  isSign: false,
  method: 'GET',
  success: noop,
  fail: noop,
};

/**
 * request
 * @param {object} options 
 */
/**
 * @method
 * 进行服务器请求
 *
 * @param {Object} options 请求配置
 * @param {string} [options.url] 请求URL
 * @param {string} [options.method] 请求方式，默认为 "GET"
 * @param {string} [options.v] 请求接口版本，默认为 "v1"
 * @param {Function} [options.success(userInfo)] 请求成功回调函数
 * @param {Function} [options.fail(error)] 请求失败回调函数
 */
const request = options => {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(message);
  }

  options = extend({}, defaultOptions, options);
  options.data = extend({}, options.data, { access_token: wx.getStorageSync('access_token') || '' })

  let data = options.data
  // 签名
  if (options.isSign) {
    // console.log('签名原串 [排序前] >>> ', JSON.stringify(data))
    data.sign = `${config.conf.SIGN}${Qs.stringify(data)}`
    // console.log('签名原串 [排序后] >>> ', data.sign)
    data.sign = SHA1(data.sign)
    // console.log('签名 [sign] >>> ', data.sign)
    data.key = config.conf.KEY
  }
  wx.request({
    url: options.url + options.v[options.version] + options.modules,
    method: options.method,
    data: data,
    success: response => {
      if (response.data.code == 1000) {
        options.success(response.data)
      } else if (response.data.code == 1005 || response.data.code == 1301) {
        // 重新登录
        login(options)
      } else {
        options.fail(error)
      }
    },
    fail: function (error) {
      options.fail(error)
    }
  })
}
/*
*
*/
const login = function (options) {
  wx.login({
    success: res => {
      let token = wx.getStorageSync('access_token')
      let sign = config.conf.SIGN + Qs.stringify({
        type: 1,
        code: res.code,
        token: token
      })
      wx.request({
        url: options.url + options.v + '/user/third',
        data: {
          type: 1,
          code: res.code,
          access_token: token,
          key: config.conf.KEY,
          sign: SHA1(sign)
        },
        success: (result) => {
          if (result.data.code === 1000) {
            wx.setStorageSync('access_token', result.data.data.access_token)
            request(options)
          }
        }
      })
    }
  })
}

module.exports = {
  request: request
}
