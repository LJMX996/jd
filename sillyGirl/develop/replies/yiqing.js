// 查疫情傻妞插件（哈尼插件）
// [rule: ?疫情 ] 武汉疫情
// [rule: 疫情 ? ] 疫情 武汉
function main() {
    var address = param(1) 
    var data = request({ 
        "url": "https://xiaobai.klizi.cn/API/other/yiqing.php?city=" + address , 
        "method": "get", 
        "dataType": "json"  
    })
    
        sendText("查询地区:" +data.城市+"\n累积确诊：" + data.积累确诊 +"\n现存确诊：" +  data.现存确诊 + "\n现存无症状："+ data.现存无症状+"\n治愈:"+data.治愈+"\n死亡:"+data.死亡+data.UpTime)

}
main()