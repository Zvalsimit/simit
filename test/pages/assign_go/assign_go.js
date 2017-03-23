//index.js
//获取应用实例
Page({
  data: {
    time: '15:10',
    categories:['物品','食品'],
    category_ind:0
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
})
