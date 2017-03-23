//index.js
//获取应用实例
var app = getApp()
var api = require('../../api.js')
Page({
  data: {
    time: '15:10',
    categories:['物品','食品'],
    category_ind:0,
    loading: false,
    expense:0,
    distribution:'',
    heat_color:'#BCBCBC',
    heat_action:false,
    car_color:'#BCBCBC',
    car_action:false,
    receiver_phone : '',
    supplier_phone : '',
    supplier_address : '',
    receiver_address : '',
    receiver_area : '小区/大厦',
    supplier_area : '小区/大厦',
    supplier_lat : '',
    supplier_lng : '',
    receiver_lat : '', 
    receiver_lng : '',
    order_fee : '0',
    order_expense : '10',
    order_price  : '',
    order_weight : '',
    order_extend_info : '',
    ship_distance : '3.0',
    pay_channel: 'wx',
    order_type : 1011,  
    first_flag : 0,
    wx_flag : 0,
    pay_flag : 0, //是否已支付
    coupon_amount : 0,
    coupon_id : 0,
    order_source : 'wx',
    all_expense :10,
    all_exp:10,
    mobile:'',
  },
  //时间处理函数
  bindTimeChange:function(e){
    this.setData({
      time: e.detail.value
    })
  },
  //品类处理函数
  bindCategoryChange:function(e){
    this.setData({
      category_ind: e.detail.value
    })
  },
  //发货地址选择
  supplierFocus:function(){
    var that = this;
    wx.chooseLocation({
      success:function(res){
        that.setData({
          supplier_area:res.name,
          supplier_lat :res.latitude,
          supplier_lng :res.longitude,
        })
        api.webApi.valuation({
          group_id: app.cityInfo.group_id,
          supplier_lat: that.data.supplier_lat, 
          supplier_lng: that.data.supplier_lng,
          receiver_lat: that.data.receiver_lat, 
          receiver_lng: that.data.receiver_lng,
          openid: that.data.openid,
          user_id: that.data.user_id,
          mobile: that.data.mobile,
          city: app.cityInfo.city,
          order_type: that.data.order_type,
          skill_type: 0,
          price_type: 0,
          expect_time: that.data.time,
          car_flag : that.data.mobile
        },that.SetPrice)
      },
      fail:function(){

      }
    })
  },
  //送货地址选择
  receiverFocus:function(){
    var that = this;
    wx.chooseLocation({
      success:function(res){
        that.setData({
          receiver_area:res.name,
          receiver_lat :res.latitude,
          receiver_lng :res.longitude,
        })
        api.webApi.valuation({
          group_id: app.cityInfo.group_id,
          supplier_lat: that.data.supplier_lat, 
          supplier_lng: that.data.supplier_lng,
          receiver_lat: that.data.receiver_lat, 
          receiver_lng: that.data.receiver_lng,
          openid: that.data.openid,
          user_id:  that.data.user_id,
          mobile:  that.data.mobile,
          city: app.cityInfo.selCity,
          order_type: that.data.order_type,
          skill_type: 0,
          price_type: 0,
          expect_time: that.data.time,
          car_flag : that.data.mobile
        },that.SetPrice)
      },
      fail:function(){
      }
    })
  },
  //发货地址
  supAddress:function(e){
    this.setData({
      supplier_address:e.detail.value
    })
  },
  //收货地址
  recAddress:function(e){
    this.setData({
      receiver_address:e.detail.value
    })
  },
  //发货电话
  supPhone:function(e){
    this.setData({
      supplier_phone:e.detail.value
    })
  },
  //收货电话
  recPhone:function(e){
    this.setData({
      receiver_phone:e.detail.value
    })
  },
  //备注
  bindextendInfo:function(){
    this.setData({
      order_extend_info:e.detail.value
    })
  },
  onLoad:function(){
    console.log(app.userInfo)
    this.setData({
      supplier_address : app.userInfo.address,
      supplier_area : app.userInfo.area,
      supplier_phone : app.userInfo.contact_mobile,
      category : app.userInfo.category?app.userInfo.category:'其他',
      supplier_lat : app.userInfo.latitude,
      supplier_lng : app.userInfo.longitude,
      pay_channel : app.userInfo.pay_channel,
    })
  },
  SetPrice:function(res){
    console.log(res)
  },
  //配送方式
  chooseExtendTap:function(e){
    if(e.currentTarget.id==='heat_box'&&!this.data.heat_action){
      this.setData({
        heat_color:'',
        heat_action:!this.data.heat_action,
      })
    }else if(e.currentTarget.id==='heat_box'&&this.data.heat_action){
      this.setData({
        heat_color:'#BCBCBC',
        heat_action:!this.data.heat_action,
      })
    }if(e.currentTarget.id!=='heat_box'&&!this.data.car_action){
      this.setData({
        car_color:'',
        car_action:!this.data.car_action,
      })
    }else if(e.currentTarget.id!=='heat_box'&&this.data.car_action){
      this.setData({
        car_color:'#BCBCBC',
        car_action:!this.data.car_action,
      })
    }
  },
  primary:function(){
    var notice = this.validate([{
      val:this.data.supplier_area,
      reg:new RegExp('[^小区/大厦]'),
      content:'请填写正确的发货地址'
      },{
      val:this.data.supplier_phone,
      reg:new RegExp("^1\d{10}$|^([0-9]{3,4})?[0-9]{7,8}$"),
      content:'请填写正确的发货电话'
      },{
      val:this.data.receiver_area,
      reg:new RegExp('[^小区/大厦]'),
      content:'请填写正确的收货地址'
      },{
      val:this.data.receiver_phone,
      reg:new RegExp("^1\d{10}$|^([0-9]{3,4})?[0-9]{7,8}$"),
      content:'请填写正确的收货地址'
      }])
    if(!notice){
      return;
    }
    app.orderInfo = {
      device : 'wx',
      url_type : 'wx',
      user_id : app.userInfo.user_id,
      mobile : app.userInfo.mobile,
      openid : '',
      order_city : app.cityInfo.city,
      group_id : app.cityInfo.group_id,
      sid : '',
      order_info : '帮我送'+this.data.categories[this.data.category_ind],
      voice_id : "",
      receiver_phone : this.data.receiver_phone,
      supplier_phone : this.data.supplier_phone,
      supplier_address : this.data.supplier_address,
      receiver_address : this.data.receiver_address,
      receiver_area : this.data.receiver_area,
      supplier_area : this.data.supplier_area,
      supplier_lat : this.data.supplier_lat,
      supplier_lng : this.data.supplier_lng,
      receiver_lat : this.data.receiver_lat, 
      receiver_lng : this.data.receiver_lng,
      expected_time : this.data.time,
      order_fee : '0',
      order_expense : '10',
      order_category  : this.data.categories[this.data.category_ind],
      order_price  : '',
      order_weight : '',
      order_extend_info : this.data.order_extend_info,
      order_distribution : this.data.distribution,
      ship_distance : '3.0',
      pay_channel: 'wx',
      order_type : 1011,  
      first_flag : 0,
      wx_flag : 0,
      pay_flag : 0, //是否已支付
      coupon_amount : 0,
      coupon_id : 0,
      order_source : 'wx',
      all_expense :10,
      all_exp:10
    }
    wx.navigateTo({
      url: '../pay/pay',
      redirect: true
    })
  },
  validate:function(arr){
    return arr.every(function(item,j){
      if(!item.reg.test(item.val)){
        wx.showModal({
          title: '提示',
          content: item.content
        })
        return false;
      }else{
        return true;
      }
    })
  }
})
/*
var date =new Date()
var date1 =new Date()
date1.setDate(date1.getDate()+22)
console.log(date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate())
console.log(date1.getFullYear()+'-'+(date1.getMonth() + 1)+'-'+date1.getDate())
 */