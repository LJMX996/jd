// 查疫情傻妞插件（哈尼插件）
// [rule: ?疫情 ] 武汉疫情
// [rule: 疫情 ? ] 疫情 武汉
function main() {
    var address = param(1) 
    var content = request({ 
        "url": "https://api.iyk0.com/yq/?msg=" + address , 
        "method": "get", 
        "dataType": "json" 
    })
    
        sendText("查询地区:" +content.查询地区+"\n目前确诊：" + content.目前确诊 +"\n死亡人数：" +  content.死亡人数 + "\n治愈人数："+ content.治愈人数+"\n新增确诊:"+content.新增确诊+"\n现存确诊:"+content.现存确诊+"\n现存无症状:"+content.现存无症状+"\n更新时间:"+content.time)

}
main()