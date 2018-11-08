var conf = {
	//数据接收地址
    server_url: "https://lc.ch.com/self/CollectForApex",
	//小程序的appid
	appId: "wx3e12eba4bfc6521e",
	//小程序的appsecret
	appSecret: "6cfb2b4d9c11784744a16748a758f096",
	// 是否开启埋点
	autoTrack: true,
	//表示是否是生产环境,false模式下控制台有log日志
	isProd: true,
	//非必传，用于匹配各个方法自动添加名称等配置信息。例如：register表示在方法中的名字。
	event: {
		register: {
			type: "tap",
			event: "event",
			eventName: "注册",
			pageUrl: 'pages/index/index'
		},
		login: {
			type: 'tap',
			event: 'event',
			eventName: '登录',
			pageUrl: 'pages/login/login'
		}
	},
	//非必传，用于匹配进入页面的地址，并配置名称
	pv: {
		'pages/activity/activity': '活动页面'
	}
}

module.exports = conf;