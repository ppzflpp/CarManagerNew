const app = getApp()


const db = wx.cloud.database({
  env: app.globalData.env
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carState:1,
    carType: null,
    catStyle: null,
    carNumber:null,
    carPrice:null,
    carBuyDate:null,
    carImage:"",
    editable : false,
    objectId : null,
    car : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options.edit",options.edit)
    if(1 == options.edit){
      this.data.editable = true;
      let car = app.globalData.editingCar;
      console.log("car",car)
      if(car){
        this.setData({
          carState: car.carState,
          carType : car.carType,
          carStyle : car.carStyle,
          carPrice : car.carPrice,
          carNumber: car.carNumber,
          carBuyDate : car.carBuyDate,
          objectId : car._id
        })
      }
    }
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

  carPriceInput: function (e) {
    console.log("carPriceInput:", e.detail.value)
    this.setData({
      carPrice: e.detail.value
    })
  },

  carBuyDateInput: function (e) {
    console.log("carBuyDateInput:", e.detail.value)
    this.setData({
      carBuyDate: e.detail.value
    })
  },

  radioChange: function(e){
    console.log(e.detail.value);
    this.setData({
      carState: e.detail.value
    })
  },

  cancelButton: function(){
    //返回上级页面
    wx.navigateBack()
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
    //添加新的车辆信息
    wx.showLoading({
      title: '正在保存',
    })
    var userInfo = db.collection('carmanager-user-info');
    wx.cloud.callFunction({
      name: 'updateCars',
      data: {
        edit:that.data.editable,
        objectId:that.data.objectId,
        openId: app.globalData.openId,
        carState: that.data.carState,
        carType: that.data.carType,
        carStyle: that.data.carStyle,
        carNumber: that.data.carNumber,
        carPrice: that.data.carPrice,
        carBuyDate: that.data.carBuyDate,
        carImage:that.data.carImage
      },
      success: res => {
        console.log('更新数据成功', res)
        //更新globalData
        app.updateGlobalData();
        wx.hideLoading();
        app.globalData.updateCars = true;
        wx.navigateBack();
      }
    })
   
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