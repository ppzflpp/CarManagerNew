const app = getApp()


const db = wx.cloud.database({
  env: app.globalData.env
})


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoList: null,
    emptyToast : "",
    hideToast : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("onLoad", app.globalData.openId);
    db.collection('carmanager-user-info').where({
      openId : app.globalData.openId
    }).get({
      success: function(res){
        console.log("get car list success ",res)
        if(res != null && res.data != null && res.data.length != 0){
          console.log("1111", res.data[0].cars)
          if(res.data[0].cars.length != 0){
            console.log("222")
            that.setData({
              userInfoList: res.data[0].cars
            });
          }else{
            console.log("333")
            that.setData({
              hideToast : false,
              emptyToast: "您还没有添加爱车哦"
            });
          }

          console.log("userInfoList", this.data.userInfoList);
          console.log("emptyToast ", this.data.emptyToast);
        }
      }
    })

  },

  addCar: function() {
    console.log("addCar")
    wx.navigateTo({
      url: '/pages/my/cars/addCar/addCar',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})