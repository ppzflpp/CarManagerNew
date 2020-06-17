const util = require('../../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    phone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  feedInput: function (e) {
    this.data.info = e.detail.value;
  },
  phoneInput: function (e) {
    this.data.phone = e.detail.value;
  },
  cancelButton: function () {
    wx.navigateBack();
  },
  confirmButton: function () {
    var info = this.data.info;
    var phone = this.data.phone;
    console.log("info : " + info);
    console.log("phone  : " + phone);

    if (phone == null || phone === "") {
      wx.showToast({
        title: '联系方式不能为空',
      })
      return;
    }

    if (info == null || info === "") {
      wx.showToast({
        title: '反馈内容不能为空',
      })
      return;
    }
    wx.showLoading({
      title: '正在提交...',
    })
    console.log("cloud.DYNAMIC_CURRENT_ENV = " + wx.cloud.DYNAMIC_CURRENT_ENV);

    wx.cloud.callFunction({
      name: 'feedback',
      data: {
        table: "feedback",
        id: app.globalData.openId,
        phone: phone,
        info: info
      },
      success: res => {
        util.log('[云函数] [feedback] ', res.result)
        wx.hideLoading();
        wx.showToast({
          title: '反馈成功',
        })
        wx.navigateBack();
      },
      fail: err => {
        util.log('[云函数] [feedback] ', err)
        wx.hideLoading();
        wx.showToast({
          title: '反馈失败',
        })
      }
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})