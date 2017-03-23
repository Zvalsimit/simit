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
        console.log(this.data.orderInfo)
    },
    couponTap:function(){

    },
    acodeTap:function(){
        
    },
    sureOrderTap:function(){
        wx.request({
            url: 'https://wx.kfw.net/flow/v1_0/order/addErrandsOrderX',
            header: {
                'Content-Type': 'application/json'
            },
            method:"POST",
            data:this.data.orderInfo,
            success:function(data){
                
            },
            fail:function(res){
                console.log(res)
            }
        })
    },
    sureOrder:function(){
        app.order_id=data.data.data.order_id;
        app.ship_id=data.data.data.ship_id;
        wx.navigateTo({
            url: '../order_detail/order_detail',
            redirect: true
        })
    }
})