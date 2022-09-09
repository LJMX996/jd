
// [cron: 0,5,10,18 8 * * *]
var ele = "https://i.loli.net/2021/12/03/MS4LKzTyd5WCc1X.jpg";
//图文消息
var content = "\n上班了，钉钉打卡咯！！！";
var imType = ImType();
if (imType == "fake") {
    var groups = [{
        imType: "wx",
        groupCode: 48102851005,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(ele)
}
