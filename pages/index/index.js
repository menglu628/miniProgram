//index.js
//获取应用实例
// var Prism = require("../../utils/prism.analysis.js");
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function(event) {
    wx.navigateTo({
      url: '../nexus/nexus'
    })
  },
  bindTestTap: function() {
    var a = this.data.userInfo;
    // Prism.sendEvent("testButton", "tap", this.data.userInfo);
  },
  onLoad: function (options) {
    console.log(options.scene);
    if (app && app.globalData && app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }

return {
        title: '自定义转发标题',
        // 分享路径，房间名+用户uid
        path: '/page/index',
        // imageUrl: this.data.shareImage,
        // 转发成功的回调函数
        success: function (res) {
            // 分享给个人：{errMsg: 'shareAppMessage:ok'}
            // 分享给群：{errMsg: 'shareAppMessage:ok', shareTickets: Array(1)}
            /* shareTicket 数组
             * 每一项是一个 shareTicket(是获取转发目标群信息的票据) ,对应一个转发对象
             */
            var shareTicket = app.globalData.options.shareTicket || ""
            /* 官网的Tip: 由于策略变动，小程序群相关能力进行调整，
             * 开发者可先使用wx.getShareInfo接口中的群ID进行功能开发。
             */
            wx.getShareInfo({
                // 把票据带上
                shareTicket: shareTicket,
                success: function (ret) {
                  console.log(ret);
                    // 如果从小程序分享没有source，如果从别人分享的再二次分享带有source
                    // 后续会讲_this.data.source的来源
                    // let source = _this.data.source ? _this.data.source : '';
                    // // 上报给后台，把群信息带给后台，后台会去解密得到需要的信息
                    // _this.upload_share_Result(res, '1', source)
                }
            })
        },
        fail: function (ret) {
          console.log(ret);
        }
    }


    // return {
    //   title: '自定义转发标题',
    //   path: '/page/index',
    //   success: function(res) {
    //     var shareTicket = app.globalData.options.shareTicket || "",
    //     wx.getShareInfo({

    //       shareTicket: shareTicket,

    //       success: function (ret) {

    //         console.log(ret.encryptedData)

    //       }

    //     })
    //   }
    // }

    // wx.showShareMenu({
    //   withShareTicket: true
    // });
    // wx.hideShareMenu()
    // wx.getShareInfo({

    //       shareTicket: app.globalData.options.shareTicket || "",
    //       timeout: 10000000,

    //       success: function (ret) {

    //         console.log(ret.encryptedData)

    //         alert(ret.iv)

    //       }

    //     })
  }
})
