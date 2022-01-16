// [rule: 付费]
// [rule: 付费车]
// [rule: 上付费车]
// [rule: 付款码]
var ele = "https://s4.ax1x.com/2022/01/16/7tFPkq.png";
//图文消息
var content = image(ele) + "\n目前付费车助力拉满，都可以跑满，相比之前的均等助力，目前助力翻了3-5呗，价格提高到10¥/🈷️。转账备注自己账号用户名(不是昵称，是京东设置里面的，长按可以复制的)。\n 用自助上车的号，上付费车可以直接私聊管理，http://47.100.44.200:9999进去登录以后，复制ck私聊发给管理，ck有效期一个月，那就每次转一个月的";
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
    }{
        imType: "wx",
        groupCode: 25454884764,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(ele)
}
