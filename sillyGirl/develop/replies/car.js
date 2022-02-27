// [rule: 上车]
// [rule: 有车吗]
// [rule: 上不了]
// [rule: 怎么登陆]
// [rule: 怎么上车]
var chezhu = "https://s2.loli.net/2022/02/27/MSyJOzNAdE9tjlD.png";
//图文消息
var content = image(chezhu) + "\n目前付费车助力直接跑满。\n相比之前的均等助力，\n 目前助力翻了3-5倍。\n 价格提高到10¥/月。\n 转账备注自己账号用户名(不是昵称，是京东设置里面的，长按可以复制的)。\n ";
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
    },{
        imType: "wx",
        groupCode: 25454884764,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendText("︎❶注意:目前自助登陆已经挂掉，需要上车的请扫码加微信手动上车。\n 两个个微信任意一个都可以\n \n 另:付费车为群友所要求，主要提供活动助力，10¥/月。\n 了解付费车可以发送付费获取详情")

    sendImage(chezhu)

}
