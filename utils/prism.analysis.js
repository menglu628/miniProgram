var userInfo = require("prism.config.js");
var systemInfos = {};

var Prism = {
	init: function(options) {
		console.log(options);
		var opts = options;
		var M = Page;
		Prism.getDefaultSettings();

		Page = function Page(t) {
		  Prism.d(t, "onLoad", () => {
		    //绑定对应的点击事件
		      var currentPage = getCurrentPages()[getCurrentPages().length - 1];
		      //获取PV
		      Prism.getUserPV(currentPage.route);
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
				    let openid = ret.data.openid || "" //返回openid
				    systemInfo["s6"] = openid; // 唯一标识
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

	getDefaultSettings: function() {
		this.getUserLocation();
		this.getUserSystemInfo();
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
			  	systemInfos["s1"] = res.system;//操作系统
			  	systemInfos["s2"] = "smallwec";//终端类型
			  	systemInfos["s3"] = res.language;//语言
			  	systemInfos["s4"] = "";
			  	systemInfos["s5"] = "";
			  	systemInfos["s8"] = res.model || "";//手机型号
			  	systemInfos["s9"] = res.version || "";//微信版本号
			  	systemInfos["s12"] = false;//默认不崩溃
			  	console.log(systemInfos);
			  }
			})
		}
	},
	//获取用户系统信息同步,TODO
	getUserSystemInfoSync: function() {
		try {
		  var res = wx.getSystemInfoSync();
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
				var latitude = res.latitude;
			    var longitude = res.longitude;
			    var address = res.address;
			    systemInfos["s15"] = latitude;
			    systemInfos["s16"] = longitude;
			    systemInfos["l1"] = address;
			    // var speed = res.speed;//官网上新文档没有了
    			// var accuracy = res.accuracy;//暂无
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
		if (propOld == "onReady") {
			console.log("pageReady");
			//get PageUrl
		}

		if (propOld == "onShow") {
			systemInfos["p4"] = new Date().toString();
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

		//TODO 分享功能
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
	        }
    	}

    	if (propOld == "onLaunch") {
    		return;
    	}

    	Prism.sendEvent();
	},

	getUserPV: function(pageUrl) {
		systemInfos["p1"] = pageUrl;
		systemInfos["p2"] = "";
		let nameList = pageUrl.split("/");;
		systemInfos["p3"] = nameList[nameList.length - 1];
	}
}
module.exports = Prism;