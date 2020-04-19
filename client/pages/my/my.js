// pages/my/my.js
const util = require("../../utils/util.js");

const app = getApp()
const db = wx.cloud.database({
  env: app.globalData.env
})


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick: "",
    logined: false,
    //默认未登录头像
    headIcon: "../../images/login.png"
  },

  onPersonalInfoClick: function() {
    console.log("onPersonalInfoClick")
  },

  onMyCarClick: function() {
    console.log("onMyCarClick")
    if(!this.data.logined){
      wx.showToast({
        title: '请先登录',
        image: '/images/fail.png'
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/my/cars/carsList/carsList',
    })
  },
  onVersionInfoClick: function() {
    console.log("onVersionInfoClick")

    wx.showModal({
      title: '版本',
      content: app.globalData.versionInfo,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onFeedClick: function() {
    console.log("onFeedClick")
    wx.showModal({
      title: '意见反馈',
      content: app.globalData.feed,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onGetUserInfo: function(e) {
    console.log("onGetUserInfo")
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      console.log("usrInfo :", e.detail.userInfo)
      this.updateUserInfo(e.detail.userInfo,true)
    } else {
      //用户按了拒绝按钮
      //do nothing
    }
  },

  updateUserInfo(res,updateDB) {
    console.log("updateUserInfo", res)
    this.setData({
      logined: true,
      nick: res.nickName,
      headIcon: res.avatarUrl,
    })

    if(!updateDB){
      console.log("不需要更新数据库信息")
      return;
    }

    //保存登录信息到数据库
    //1、先判断之前是否有记录
    db.collection("carmanager-user-info").where({
      openId: app.globalData.openId
    }).get({
      success: function(res1){
        console.log("res1 = ",res1);
        console.log("res1.data.length = ", res1.data.length);
        if(res1 == null || res1.data == null || res1.data.length == 0){
          console.log("没有记录 ")
          let date = util.formatTime(new Date())
          //2、没有记录，添加新的记录进去
          db.collection("carmanager-user-info").add({
            data: {
              registerDate: date,
              openId: app.globalData.openId,
              nick: res.nickName,
              cars: []
            },
            success: function (res2) {
              console.log("add new user ", res2)
            }
          });
        }else{
          console.log("有记录，不用重新添加");
        }
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = app.globalData.userInfo;
    console.log("my page load,userInfo", userInfo)
    if (userInfo != null && userInfo != "") {
      this.updateUserInfo(app.globalData.userInfo,false)
    }
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