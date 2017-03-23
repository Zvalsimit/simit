// api.js
var webApi = {
  api:{
      login : 'https://wx.kfw.net/flow/v1_0/user/pc/login',
      groupList : 'https://wx.kfw.net/flow/v1_0/group/getGroupList',
      auxiliary:'https://wx.kfw.net/flow/v1_0/order/auxiliaryInfo',
      ServicePrice:'https://wx.kfw.net/flow/v1_0/price/getServicePrice',
  },
  groupList:function(data,callback){
    wx.request({
        url: this.api.groupList,
        header: {
            'Content-Type': 'application/json'
        },
        method:"POST",
        data:data,
        success:function(res){
          callback(res)
        },
        fail:function(res){
        }
      })
  },
  auxiliary:function (callback){
    wx.request({
        url: this.api.auxiliary,
        header: {
            'Content-Type': 'application/json'
        },
        method:"POST",
        success:function(res){
          callback(res)
        },
        fail:function(res){
          console.log(res)
        }
      })
  },
  valuation:function (data,callback){
    wx.request({
        url: this.api.ServicePrice,
        header: {
            'Content-Type': 'application/json'
        },
        method:"POST",
        data:data,
        success:function(res){
          callback(res)
        },
        fail:function(res){
        }
      })
  }
}
module.exports.webApi = webApi