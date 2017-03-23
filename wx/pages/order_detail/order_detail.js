//pay.js
var app = getApp()
Page({
    data:{
        orderInfo:{}
    },
    onLoad:function(){
        this.setData({
           orderInfo: app.orderInfo
        })
        console.log(app.order_id)
    },
    bindPhone:function(){
        wx.makePhoneCall({
            phoneNumber: '1340000'
        })
    }
})