//index.js
const util = require('../../utils/util.js')

const app = getApp();

Page({
  data: {
    newsList: [],
    imageArray: ['../../images/jiayou.png', '../../images/xiche.png', '../../images/weixiu.png', '../../images/baoyang.png', '../../images/baoxian.png', '../../images/qita.png']
  },

  addInfo: function () {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },

  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })

    if (!app.globalData.openId) {
      app.openIdReadyCallback = res => {
        util.log("openIdReadyCallback",null);
        //第一次初始化程序 需要加载数据
        this.loadData();
      }
    } else {
      //第一次初始化程序 需要加载数据
      this.loadData();
    }
  },
  //加载数据
  loadData: function () {
    var that = this;
    // 显示顶部刷新图标
    wx.showLoading({
      title: '正在加载数据...',
    });

    wx.cloud.callFunction({
      name: 'query',
      data :{
        tableName : app.globalData.tableName,
        openId : app.globalData.openId
      },
      success: function(res) {
        util.log("res 333", res.result.data);
        if (res.result.data == 0) {
          that.setData({
            empty_content: '无内容，请添加'
          })
        } else {
          that.setData({
            empty_content: ''
          })
        }
        that.setData({
          newsList: res.result.data
        });
        app.globalData.itemList = res.result.data;
        
        wx.hideLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      fail: function(err)  {
        util.log('[云函数] [query] error', err)
        wx.hideLoading();
      }
    });
  },

  onItemClick: function (res) {
    util.log("xxxxx",res)
    var clickIndex = res.currentTarget.dataset.clickindex;
    util.log('onItemClick,clickIndex = ' , clickIndex);
    app.globalData.editingInfo = this.data.newsList[clickIndex];
    wx.navigateTo({
      url: '../edit/edit?edit=1&clickIndex=' + clickIndex,
    })
  },

  onAddClick: function () {
    var that = this;
    // 判断是否已经登录
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          util.log("未授权，先登录");
          wx.showToast({
            title: '请先登录',
            image: '/images/fail.png'
          })
          /*
          wx.switchTab({
            url: '/pages/my/my',
          })
          */
        } else {
          //判断是否已经添加车辆
          if(app.globalData.carList == null || app.globalData.carList.length ==0){
            wx.showToast({
              title: '请添加车辆信息',
            })
            return;
          }
          util.log("已经授权");
          //正常跳转
          wx.navigateTo({
            url: '/pages/edit/edit',
          })
        }
      }
    })
  },

  onShow: function () {
    if (app.globalData.updateData) {
      util.log("data dirty ,update",null);
      this.loadData();
      app.globalData.updateData = false;
    } else {
      util.log("data not dirty ",null);
    }
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onShareAppMessage: function (res) {
    util.log("onShareAppMessage",null)
    return {
      title: '一个月养车尽然花这么多钱？',
      path: '/pages/index/index',
      success: function (res) {
        util.log("share success",null)
      },
      fail: function (res) {
        util.log("share fail",null)
      }
    }
  }
})