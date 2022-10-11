
// [cron: 0,5,10,20 8 * * 1-5]
var ele = "https://i.loli.net/2021/12/03/MS4LKzTyd5WCc1X.jpg";
//图文消息
var content = "\n上班摸鱼了，\n 记得钉钉打卡撒！！！";
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
