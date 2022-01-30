// [rule: 上车]
// [rule: 有车吗]
// [rule: 上不了]
// [rule: 怎么登陆]
// [rule: 怎么上车]
var ele = "https://s2.loli.net/2022/01/23/WSkmfsjKLybJgrM.jpg";
//图文消息
var content = image(ele) + "\n目前付费车助力直接跑满。\n相比之前的均等助力，\n 目前助力翻了3-5倍。\n 价格提高到10¥/月。\n 转账备注自己账号用户名(不是昵称，是京东设置里面的，长按可以复制的)。\n ";
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
    sendText("︎❶注意:目前自助登陆已经挂掉，需要上车的请加微信手动上车。\n 三个微信任意一个都可以\n 微信① liuqing24637 \n 微信② XuMingJianDe \n 微信③ dyl754363011 \n 另:付费车为群友所要求，主要提供活动助力，10¥/月。\n 区别:免费车用户没有活动助力。\n 付费车就是七个长期活动有助力 \n 助力数量规则: \n 目前付费车用户助力可以拉满 \n (东东农场，东东萌宠，东东工厂，种豆得豆，健康社区，京喜财富岛，京喜工厂) \n 助力拉满任务完成速度比没有助力快两倍 \n 付费车联系微信: liuqing24637 \n ")
    sendText("\n目前付费车助力直接跑满。\n相比之前的均等助力，\n目前助力翻了3-5倍。\n价格提高到10¥/月。\n转账备注自己账号用户名\n(不是昵称，是京东设置里面的，长按可以复制的)。")

}
