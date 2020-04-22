const app = getApp()


const db = wx.cloud.database({
  env: app.globalData.env
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carType: null,
    catStyle: null,
    carNumber:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
  },

  carTypeInput: function (e) {
    console.log("carTyleInput:", e.detail.value)
    this.setData({
      carType: e.detail.value
    })
  },

  carStyleInput: function (e) {
    console.log("carStyleInput:", e.detail.value)
    this.setData({
      carStyle: e.detail.value
    })
  },

  carNumberInput: function (e) {
    console.log("carNumberInput:", e.detail.value)
    this.setData({
      carNumber: e.detail.value
    })
  },

  cancelButton: function(){
    //返回上级页面
    wx.navigateBack({  
    })
  },

  confirmButton: function(){

    //检测是否填写信息
    if (this.data.carType == null || this.data.carType.replace(/\s+/g, '') === ''){
      wx.showToast({
        title: '车型不能为空',
      })
      return;
    }

    if (this.data.carStyle == null || this.data.carStyle.replace(/\s+/g, '') === '') {
      wx.showToast({
        title: '车系不能为空',
      })
      return;
    }

    if (this.data.carNumber == null || this.data.carNumber.replace(/\s+/g, '') === '') {
      wx.showToast({
        title: '车牌号不能为空',
      })
      return;
    }


    var that = this;

    console.log("app.globalData.openId", app.globalData.openId);

    console.log("    app.globalData.env", app.globalData.env);
    //添加新的车辆信息
    wx.showLoading({
      title: '正在保存',
    })
    var userInfo = db.collection('carmanager-user-info');
    wx.cloud.callFunction({
      name: 'updateCars',
      data: {
        tableName: 'carmanager-user-info',
        openId: app.globalData.openId,
        env: app.globalData.env, 
        info: {
          carType: that.data.carType,
          carStyle: that.data.carStyle,
          carNumber: that.data.carNumber,
        }
      },
      success: res => {
        console.log('更新数据成功', res)
        //更新globalData
        app.updateGlobalData();
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/my/my',
        })
      }
    })
    /*
    userInfo.where({
      openId : app.globalData.openId
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log("confirmButton",res);
        if(res.data != null && res.data.length != 0){
          //保持车辆信息
          console.log("1,_id = ", res.data[0]._id);
          wx.cloud.callFunction({
            name: 'update',
            data: {
              tableName: 'carmanager-user-info',
              _id: res.data[0]._id,
              info: {
                carType: that.data.carType,
                carStyle: that.data.carStyle,
                carNumber: that.data.carNumber,
              }
            },
            success: res => {
              console.log('更新数据成功',res)
            }
          })
        }
      }
    })
    */
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