
// [cron: 25 8 * * *]
var ele = "https://i.loli.net/2021/12/03/MS4LKzTyd5WCc1X.jpg";
//图文消息
var content = "\n还有叼毛没打卡吗，\n 20以后打卡扣工资哦！！！";
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
