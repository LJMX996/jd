// [rule: 外卖]
// [rule: 饿了么]
// [cron: 10 7,11,17 * * *]
var ele = "https://raw.githubusercontent.com/LJMX996/jd/aaron/tmp/elm.png";
//图文消息
var content = image(ele) + "\n到饭点啦，微信扫码领饿了么20元无门槛饭票！！！";
var imType = ImType();
if (imType == "fake") {
    var groups = [{
        imType: "wx",
        groupCode: 25331963676,
    },{
        imType: "wx",
        groupCode: 20481317764,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(ele)
}
