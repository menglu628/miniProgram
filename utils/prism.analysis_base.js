var userInfo = require("prism.config.js");

var PRISM = {
    send: send,
    bind: bind
};

var src = (userInfo.protocol ? userInfo.protocol : "https") + userInfo.url + "/data/api/event";

function send(args) {
    var mySrc = userInfo.url ? src : "";
    wx.request({
        url: mySrc,
        data: {
            data: args
        },
        header: {  
            "Content-Type": "application/x-www-form-urlencoded"  
        },  
        method: "get",
        success: function() {},
        fail: function() {
            console.error( '网络请求失败' )
        }
    })
}

function bind (page, e){
    if(e){
        var prismInfo = userInfo.log_event[e][page];
    }else{
        var prismInfo = userInfo.log_event[page];
    }

    var data = {};
    data["tid"] = userInfo.tid || "";
    data["utc"] = Date.parse(new Date())/1000;
    data["ids"] = {
        "cuid": userInfo.cuid || ""
    };
    data["type"] = prismInfo.type ||　"event";
    data["eventtype"] = prismInfo.eventtype || "实时事件";
    data["version"] = userInfo.version || 1;
    data["event"] = prismInfo.eventLabel || "";
    data["properties"] = {
        "Page_Hostname": userInfo.Page_Hostname || "",
        "Page_Path": userInfo.Page_Path || "",
        "Page_URL": userInfo.Page_URL || "",
    }

    send(data);
}
module.exports = PRISM;