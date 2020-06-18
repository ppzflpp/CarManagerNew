// client/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage : "main"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  navChange: function(e) {
    this.setData({
      currentPage: e.currentTarget.dataset.cur
    })
  },
  addRecord: function(){
    var that = this;
    // 判断是否已经登录
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          console.log("未授权，先登录");
          wx.showToast({
            title: '请先登录',
            image: '/images/fail.png'
          })
        } else {
          console.log("已经授权");
          //正常跳转
          wx.navigateTo({
            url: '/pages/edit/edit',
          })
        }
      }
    })
  }
})