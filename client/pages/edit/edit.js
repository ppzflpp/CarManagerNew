  // pages/edit/edit.js
  const util = require('../../utils/util.js')
  const app = getApp()

  Page({

    /**
     * 页面的初始数据
     */
    data: {
      indexStyle: 0,
      styleArray: ['加油费', '洗车费', '维修费', '保养费', '保险费', '其它'],
      styleArrayAlias: ['jiayou', 'xiche', 'weixiu', 'baoyang', 'baoxian', 'other'],
      //车辆信息
      indexCar : 0,
      carArray: [],
      currentDate: '',
      money: 0,
      distance: 0,
      info: '',
      _id: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      //初始化车辆信息
      var tempArray = [];

      var that = this;
      if (options.edit == 1) {
        wx.setNavigationBarTitle({
          title: '编辑',
        });

        //获取要编辑的信息
        var tmpInfo = app.globalData.editingInfo;
        //创建显示的数组
        var tmpIndexCar = 0;
        var t = app.globalData.carList;
        for (var i = 0; i < t.length; i++) {
          tempArray[i] = t[i].carType + "  " + t[i].carStyle;
          console.log("t = ",t[i]);
          console.log("tmpInfo = ",tmpInfo);
          if(t[i]._id === tmpInfo.carId){
            tmpIndexCar = i;
          }
        }
        console.log("tmpIndexCar = ",tmpIndexCar);
        that.setData({
          currentDate: tmpInfo.date,
          indexStyle: tmpInfo.index,
          money: tmpInfo.money,
          info: tmpInfo.info,
          distance: tmpInfo.distance,
          indexCar: tmpIndexCar,
          carArray: tempArray,
          _id: tmpInfo._id
        })
      } else {
        wx.setNavigationBarTitle({
          title: '添加',
        });

        //创建显示的数组
        var t2 = app.globalData.carList;
        for (var i = 0; i < t2.length; i++) {
            tempArray[i] = t2[i].carType + "  " + t2[i].carStyle;
        }  

        this.setData({
          currentDate: util.formatTime(new Date()),
          indexStyle: 0,
          indexCar: 0,
          carArray: tempArray,
        })
      }
    },



    bindPickerDate: function (res) {
      util.log('currentDate = ' + res.detail.value);
      this.setData({
        currentDate: res.detail.value
      })
    },

    bindPickerStyle: function (res) {
      util.log('indexStyle = ' + res.detail.value);
      this.setData({
        indexStyle: res.detail.value
      })
    },

    cancelButton: function (res) {
      wx.navigateBack({});
    },

    confirmButton: function (res) {
      var style = this.data.styleArray[this.data.indexStyle];
      var styleAlias = this.data.styleArrayAlias[this.data.indexStyle];
      var index = "" + this.data.indexStyle
      var date = this.data.currentDate;
      var money = this.data.money;
      var info = this.data.info;
      var updateDate = util.formatTime(new Date());
      var distance = this.data.distance;
      var carId = app.globalData.carList[this.data.indexCar]._id;
      util.log("sytle = " + style + ",index = " + index + ",data = " + date + ",money = " + money + ",info = " + info + ',user_id = ' + app.globalData.openId + ',updateDate ' + updateDate + ",distance = " + distance  + ",carId = " + carId);
      //显示加载框
      wx.showLoading({
        title: '正在保存...',
      })

      var cloudFunName = '';
      var saveData = {};
      if (this.data._id) {
        cloudFunName = 'update'
        saveData._id = this.data._id;
      } else {
        cloudFunName = 'insert'
      }

      saveData.user_id = app.globalData.openId;
      try {
        saveData.index = parseInt(index);
        saveData.money = parseFloat(money);
        saveData.distance = parseInt(distance);
        saveData.carId = carId;
      } catch (error) {
        console.log('save error', error)
        saveData.index = index;
        saveData.money = money;
        saveData.distance = distance;
        saveData.carId = carId;
      }
      saveData.style = style;
      saveData.style_alias = styleAlias;
      saveData.date = date;
      saveData.info = info;
      saveData.updateDate = updateDate;
      saveData.tableName = app.globalData.tableName;

      util.log("cloudFun:" + cloudFunName, null)
      util.log("saveData = ", saveData);

      wx.cloud.callFunction({
        name: cloudFunName,
        data: saveData,
        success: function (res) {
          util.log("success:cloudFun" + cloudFunName, res)
          wx.hideLoading();
          wx.showToast({
            title: '已保存',
          });
          app.globalData.updateData = true;
          wx.navigateBack({});
        },
        fail: function (res) {
          util.log("fail:cloudFun" + cloudFunName, res);
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
          })
        }
      });
    },

    getMoney: function (res) {
      this.data.money = res.detail.value;
    },

    getInfo: function (res) {
      this.data.info = res.detail.value;
    },

    getDistance: function (res) {
      this.data.distance = res.detail.value;
    },
    carSelect: function (res) {
      console.log("carSelect", res.detail.value);
      this.setData({
        indexCar: res.detail.value
      });
    }
  })