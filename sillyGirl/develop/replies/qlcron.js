// [rule: 1600指令]



var content = image(chezhu) + "\n目前付费车助力直接跑满。\n相比之前的均等助力，\n 目前助力翻了3-5倍。\n 由于豆子收入减少，价格降低到8¥/月。\n 转账备注自己账号用户名(不是昵称，是京东设置里面的，长按可以复制的)。\n ";
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
    sendText("︎脚本执行指令: \n 1600云函数并发\n ql task 1600.sh\n \n 另: \n ql cron run 1600")



}
