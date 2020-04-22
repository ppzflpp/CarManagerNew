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
    currentDate: '',
    money: 0,
    info: '',
    _id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options._id) {
      wx.setNavigationBarTitle({
        title: '编辑',
      }) ;
      util.log("TABLE_NAME = ",app.globalData.tableName)
      util.log("_id = ",options._id)
      wx.cloud.callFunction({
        name : 'queryById',
        data : {
          tableName : app.globalData.tableName,
          _id : options._id
        },
        success : function(res){
          util.log('res result',res);
          var res = res.result.data;
          that.setData({
            currentDate: res[0].date,
            indexStyle: res[0].index,
            money: res[0].money,
            info: res[0].info,
            _id: options._id 
          })
        },
        fail : function(err){
          util.log("query",err);
        }
      });
    } else {
      wx.setNavigationBarTitle({
        title: '添加',
      });
      this.setData({
        currentDate: util.formatTime(new Date()),
        indexStyle: 0,
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
    util.log('indexStyle = ' + res.detail.value );
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
    var index = ""+this.data.indexStyle
    var date = this.data.currentDate;
    var money = this.data.money;
    var info = this.data.info;
    var updateDate = util.formatTime(new Date());
    util.log("sytle = " + style + ",index = " + index + ",data = " + date + ",money = " + money + ",info = " + info + ',user_id = ' + app.globalData.openId + ',updateDate '+ updateDate,null);
    //显示加载框
    wx.showLoading({
      title: '正在保存...',
    })

    var cloudFunName = '';
    var saveData = {};
    if(this.data._id){
      cloudFunName = 'update'
      saveData._id = this.data._id;
    }else{
      cloudFunName = 'insert'
    }

    saveData.user_id = app.globalData.openId;
    saveData.index = index;
    saveData.style = style;
    saveData.style_alias = styleAlias;
    saveData.date = date;
    saveData.money = money;
    saveData.info = info;
    saveData.updateDate = updateDate;
    saveData.tableName = app.globalData.tableName;

    util.log("cloudFun:" + cloudFunName,null)
    util.log("saveData = ", saveData);

    wx.cloud.callFunction({
      name : cloudFunName,
      data : saveData,
      success : function(res){      
        util.log("success:cloudFun" + cloudFunName,res)
        wx.hideLoading();
        wx.showToast({
          title: '已保存',
        });
        app.globalData.updateData = true;
        wx.navigateBack({});
      },
      fail : function(res){
        util.log("fail:cloudFun" + cloudFunName,res);
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
  }
})