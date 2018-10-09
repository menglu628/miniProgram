var userInfo = require("prism.config.js");

var Prism = {
	init: function(options) {
		console.log(options);
		var opts = options;
		var M = Page;

		Page = function Page(t) {
		  Prism.d(t, "onLoad", () => {
		    //绑定对应的点击事件
		      var currentPage = getCurrentPages()[getCurrentPages().length - 1];
		      let json = {};
		      for (let propOld in currentPage) {
		          if (typeof currentPage[propOld] == "function") {
		            json[propOld] = currentPage[propOld];
		            currentPage[propOld] = function(e) {
		            	Prism.userEventSplit(propOld, e);
		              // Prism.getUserSetting();
		                (json[propOld]).apply(this, arguments);
		            }
		          }
		        }
		  });
		  M(t);
		}
	},
	//用户登录，获取appId
	getUserLogin: function() {
		wx.login({
	      success: function(res) {
	      	// console.log(res.code);
	        if (res.code) {
	        	wx.request({
				  url: 'https://api.weixin.qq.com/sns/jscode2session',
				  data: {
				  	appid: userInfo.appId,
				  	secret: userInfo.appSecret,
				  	js_code: res.code,
				  	grant_type:　"authorization_code"
				  },
				  header: {
				      'content-type': 'application/json'
				  },
				  success: function(ret) {
				    let openid = ret.data.openid //返回openid
				      if (openid != null && openid != undefined) {
				      	wx.getUserInfo({
							withCredentials: false,
							success: function(res) {
								console.log("获取" + res);
							}
						})
				      }
				  }
				})
	        } else {
	          console.log('登录失败！' + res.errMsg)
	        }
	      }
	    });
	},
	//获取用户当前设置
	getUserSetting: function() {
		//查看是否授权
		if (wx.getSetting) {
			wx.getSetting({
				success: function(res) {
					if (res.authSetting["scope.userInfo"]) {
						wx.getUserInfo({
							withCredentials: true,
							success: function(res) {
								console.log(res);
							}
						})
					}
				},
				fail: function(error) {
					console.log(error);
				}
			})
		}
	},
	//获取用户系统信息
	getUserSystemInfo: function() {
		if (wx.getSystemInfo) {
			wx.getSystemInfo({
			  success: function(res) {
			    console.log(res.model)
			    console.log(res.pixelRatio)
			    console.log(res.windowWidth)
			    console.log(res.windowHeight)
			    console.log(res.language)
			    console.log(res.version)
			    console.log(res.platform)
			  }
			})
		}
	},
	//获取用户系统信息同步
	getUserSystemInfoSync: function() {
		try {
		  var res = wx.getSystemInfoSync()
		  console.log(res.model)
		  console.log(res.pixelRatio)
		  console.log(res.windowWidth)
		  console.log(res.windowHeight)
		  console.log(res.language)
		  console.log(res.version)
		  console.log(res.platform)
		} catch (e) {
		  // Do something when catch error
		  Prism.getUserSystemInfo();
		}
	},
	//获取当前位置
	getUserLocation: function() {
		wx.getLocation({
			type: "wgs84",
			success: function(res) {
				var latitude = res.latitude
			    var longitude = res.longitude
			    var speed = res.speed
    			var accuracy = res.accuracy
			}
		})
	},

	sendEvent: function(eventName, event, data) {
		let dataMap = {
			data: {
	          tid: userInfo.tid || "", 
	          utc: Date.parse(new Date())/1000, 
	          "ids": {
	              "cuid": userInfo.cuid
	          },
	          "type": "event",
	          "version": 1,
	          "event": (data && data.eventName) ? data.eventName : "",
	          "eventtype": "实时事件",
	          "properties": data
	        }
		}
		// wx.request({
		// 	url: "http://" + userInfo.url + "/data/api/event",
		// 	data: dataMap,
		// 	header: {  
		//         "Content-Type": "application/x-www-form-urlencoded"  
		//     },  
		// 	method: "get",
		// 	success: function() {},
		// 	fail: function() {
		// 		console.error( '网络请求失败' )
		// 	}
		// })
	},
	d: function(t, a, e) {
		if (t[a]) {
		    var s = t[a];
		    t[a] = function (t) {
		      e.call(this, t, a);
		      s.call(this, t);
		    };
		  } else {
		    t[a] = function (t) {
		      e.call(this, t, a);
		    };
		  }
	},

	userEventSplit: function(propOld, e) {
		if (propOld == "onShow") {
    		wx.setStorage({
    			key: "currentPageStart",
    			data: new Date().toString(),
    			success: function(res){
    				// console.log(res);
    			}
    		})
    	}

    	if (propOld == "onHide") {
    		wx.setStorage({
    			key: "currentPageEnd",
    			data: new Date().toString(),
    			success: function(res){
    				// console.log(res);
    			}
    		});
    	}

    	if (e && e.from && e.from == "menu") {
    		if (typeof wx["getShareInfo"] != "undefined") {
	            wx.getShareInfo({
	                shareTicket: opts.shareTicket,
	                success: function(res) {
	                    console.log(res);
	                },
	                fail: function(res) {
	                    console.log(res);
	                }
	            })
	        } else {
	            // console.log("111");
	        }
    	}

    	if (propOld == "onLaunch") {
    		return;
    	}

    	Prism.sendEvent();
	},

	getUserPV: function() {

	}
}
module.exports = Prism;