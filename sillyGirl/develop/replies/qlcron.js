// [rule: 1600]


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
    sendText("︎1600云函数并发命令")

    sendText("︎ql task 1600.sh")
    
    sendText("︎另:") 
    sendText("ql cron run 1600") 
}
