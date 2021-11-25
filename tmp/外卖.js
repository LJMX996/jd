// [rule: 外卖]
// [rule: 饿了么]
// [rule: 美团]
// [cron: 40 6,10,16 * * *]
var ele = "https://pic.baixiongz.com/uploads/2021/11/25/11f547fdf68ff.jpeg";
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
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(ele)
}
