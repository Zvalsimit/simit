//index.js
//获取应用实例
var app = getApp()
var api = require('../../api.js')
Page({
  data: {
    personalUrl:'../../imgs/my.png',
    logoUrl:'../../imgs/logo.png',
    city : [],
    citiesList:[],
    index:0,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    menu:[{
      imgUrl : '../../imgs/1.jpg',
      title : '随意购',
      pri : 8,
      dec : '专人跑腿代购，什么都能买',
      pricerule : '3公里内8元，超出部分1.6元/公里',
    },{
      imgUrl : '../../imgs/2.jpg',
      title : '急送',
      pri : 8,
      dec : '专人直送，5公里60分钟必达',
      pricerule : '3公里内8元，超出部分1.6元/公里',
    },{
      imgUrl : '../../imgs/3.jpg',
      title : '当日达',
      pri : 10,
      dec : '16点前递件，当日送达',
      pricerule : '2环内10元，3环内12元',
    },{
      imgUrl : '../../imgs/4.jpg',
      title : '货运',
      pri : 50,
      dec : '长x宽x高（2mx1.5mx1m）',
      pricerule : '超出部分3元/公里',
    }]
  },
  //事件处理函数
  bindViewTap: function() {
    app.cityInfo.selCity = this.data.city[this.data.index];
    app.cityInfo.citiesList = this.data.citiesList[this.data.index]
    wx.navigateTo({
      url: '../assign_go/assign_go',
      redirect: true
    })
  },
  personalTap:function(){
    wx.navigateTo({
      url: '../logs/logs',
      redirect: true
    })
  },
  logoTap:function(){
    wx.navigateTo({
      url: '../logs/logs',
      redirect: true
    })
  },
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  onLoad:function(){
    let that = this;
    api.webApi.auxiliary(this.mySetData)
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
         api.webApi.groupList(res,that.cityList)
      }
    })
    wx.checkSession({
      success: function(){
        console.log('登录态未过期')
      },
      fail: function(){
        console.log('登录态过期')
        wx.login()
      }
    })
  },
  changeText:function(){
    this.setData({   
      text: 'changed data'
    })   
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  mySetData:function(data){
    app.userInfo = data.data.data;
    console.log(data.data.data)
  },
  cityList:function(data){
    var city=[],citiesList=[];
    data.data.data.data.sort(this.compare('f_letter')).forEach(function(item,index){
      city.push(item.show_text)
      citiesList.push(item)
    })
    this.setData({
      city: city,
      citiesList : citiesList
    })
  },
  compare:function (attr){
    return function(a,b){return a[attr].localeCompare(b[attr])}
  }
})
