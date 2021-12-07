
// [cron: 40 11 * * *]
var ele = "https://i.loli.net/2021/12/03/MS4LKzTyd5WCc1X.jpg";
//图文消息
var content = image(ele) + "\n到饭点啦，微信扫码领饭票了！！！";
var imType = ImType();
if (imType == "fake") {
    var groups = [{
        imType: "wx",
        groupCode: 25331963676,
    },{
        imType: "wx",
        groupCode: 20481317764,
    },{
        imType: "wx",
        groupCode: 21784132403,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(ele)
}
