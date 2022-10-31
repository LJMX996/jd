
// [cron: 0,5,10 18 * * 1-5]
var ele = "https://i.loli.net/2021/12/03/MS4LKzTyd5WCc1X.jpg";
//图文消息
var content = "\n愉快的一天从下班开始，\n 记得钉钉打卡哦！！！";
var imType = ImType();
if (imType == "fake") {
    var groups = [{
        imType: "wx",
        groupCode: 48102851005,
    },{
        imType: "wx",
        groupCode: 49190051947,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(ele)
}
