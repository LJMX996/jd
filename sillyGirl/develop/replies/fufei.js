// [rule: 付费]
// [rule: 付费车]
// [rule: 上付费车]
// [rule: 付款码]
// [rule: 续费]
var qun = "https://s2.loli.net/2022/02/17/ZmPNLftrFhKvxaV.jpg";
var money = "https://s2.loli.net/2022/02/04/pmHrMBW6AnPU4Q5.jpg";
//图文消息
var content = image(qun) + image(money) + "\n目前付费车助力直接跑满。\n相比之前的均等助力，\n 目前助力翻了3-5倍。\n 由于豆子收入降低，价格降低到8¥/月。\n 转账备注自己账号用户名(不是昵称，是京东设置里面的，长按可以复制的)。\n 用自助上车的号，上付费车可以直接私聊管理。\n";
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

    sendText("\n区别: \n 免费车用户没有活动助力。\n 付费车就是七个长期活动有助力 \n 助力数量规则: \n 目前付费车用户助力可以拉满 \n (东东农场，东东萌宠，东东工厂，种豆得豆，健康社区，京喜财富岛，京喜工厂) \n 助力拉满任务完成速度比没有助力快两倍 \n相比之前的均等助力，\n目前助力翻了3-5倍。\n由于豆子收入降低，价格降低到8¥/月。\n转账备注自己账号用户名\n(不是昵称，是京东设置里面的，长按可以复制的)。")
        sendText("\n 另: \n 目前付费车有额外的30-90豆子，目前有效期两天，自己抉择\n 付费全体用户跑极速版金币 \n 付费车联系微信: liuqing24637 \n ")
    sendText("\n目前付费车已满，还有人想上付费车可以先进群，或者加微信 \n liuqing24637 \n 如果不想被别人挤下付费车，请提前续费，付费群二维码失效可以找管理")
    sendImage(qun)
    sendImage(money)
     
}
