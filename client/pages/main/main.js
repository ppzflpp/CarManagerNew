const util = require('../../utils/util.js')
const app = getApp()


const db = wx.cloud.database({
  env: app.globalData.env
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList: [], //存储车辆信息
    carInfo: [], //存储对应车辆的消耗，公里数等信息
    carState: true,
    backgroundUrl: "/images/background.jpeg",
    distance: '--',
    cost: '--',
    loadingData1: true,
    loadingData2: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    })
    if (!app.globalData.openId) {
      app.openIdReadyCallback = res => {
        util.log("openIdReadyCallback", null);
        //第一次初始化程序 需要加载数据
        this.initData1();

      }
    } else {
      //第一次初始化程序 需要加载数据
      this.initData1();
    }

  },

  initData1: function () {
    console.log("initData");
    let that = this;
    wx.cloud.callFunction({
      name: 'queryCarsInfo',
      data: {
        openId: app.globalData.openId
      },
      success: res => {
        util.log("get car list success ", res)
        if (res.result != null) {
          var serverCarList = res.result;
          if (serverCarList.length != 0) {
            //更新界面信息
            that.setData({
              carList: serverCarList,
            });
            app.globalData.carList = serverCarList;
          } else {
            that.setData({
              hideToast: false,
              emptyToast: "您还没有添加爱车哦"
            });
          }
        }
        wx.hideLoading();
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
    //当新增车辆时更新该界面
    if(app.globalData.updateCars){
      wx.showLoading({
        title: '正在加载...',
      })
      this.initData1();
      app.globalData.updateCars = false;
    }
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

  },
  addCar: function () {
    wx.navigateTo({
      url: '/pages/my/cars/addCar/addCar?edit=0',
    })
  },
  onItemClick : function(e){
    var index = e.currentTarget.dateset.index;
    console.log("onItemLick",index);
    app.globalData.editingCar = this.data.carList[index];
    wx.navigateTo({
      url: '/pages/my/cars/addCar/addCar?edit=1&index=' + index,
    })
  }
})