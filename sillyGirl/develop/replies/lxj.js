
// [cron: 25 12,18 * * 0,1]
var ele = "";
//图文消息
var content = "\n抢领现金了，冲冲冲！！！";
var imType = ImType();
if (imType == "fake") {
    var groups = [{
        imType: "wx",
        groupCode: 24746898582,
    },{
        imType: "wx",
        groupCode: 23636181937,
    }]
    for (var i = 0; i < groups.length; i++) {
        groups[i]["content"] = content
        push(groups[i])
    }
} else {
    sendImage(content)
}