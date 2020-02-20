//app.js
const  Bmob = require('./dist/Bmob-1.7.0.min.js');
var db = null;

App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    Bmob.initialize("c2a2830a959fe3adf2d223f3fa89d630", "e64d193a585a1c08f5d781a8cd48f448");
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (this.globalData.DEBUG) {
      this.globalData.tableName = "records_test"
      this.globalData.env = 'test-dragon-study-ef1221'
    } else {
      this.globalData.tableName = "records"
      this.globalData.env = 'release-5q0el'
    }
    console.log('tableName = ' + this.globalData.tableName);

    db = wx.cloud.database({
      env: this.globalData.env   
    })

    var that = this;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("login success,",res)
        if (res.code) {
          var params = {
            funcName: 'getOpenId',
            data: {
              name: res.code
            }
          }

          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              console.log('[云函数] [login] user openid: ', res.result.openid)
              that.globalData.openId = res.result.openid
              //主要是用来更新realUserInfo
              that.updateGlobalData();

              if (that.openIdReadyCallback) {
                that.openIdReadyCallback()
              }
            },
            fail: err => {
              console.log('[云函数] [login] get user openid error')
            }
          });
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("获取用户信息成功,信息如下：", this.globalData.userInfo);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          console.log("未授权");
        }
      }
    })
  },

  updateGlobalData : function(){
    var that = this;
    console.log("updateGlobalData");
    //获取服务器存储用户信息
    db.collection('carmanager-user-info').where({
      openId: this.globalData.openId
    }).get({
      success: function (res) {
        if (res != null && res.data != null && res.data.length != 0) {
          that.globalData.realUserInfo = res.data[0];
          console.log("初始化：globalData.realUserInfo", that.globalData.realUserInfo);
        }
      }
    });
  },


  globalData: {
    realUserInfo : null,
    userInfo: null,
    updateData: false,
    openId: '',
    itemList: null,
    tableName: "",
    env:"",
    DEBUG: true,
    versionInfo:'当前版本：v1.5.0 ',
    feed:'请加微信给作者反馈意见，微信：lfz_123_lfz'
  }
})