//[rule: ?油价 ] 例北京油价

var key="51c97f482dec8bbdccb2fb79d80a53bf"//天行数据申请的key网站https://www.tianapi.com/
function main() {
    var add = param(1) //匹配规则第一个问号的值
    var content = request({ // 内置http请求函数
        "url": "http://api.tianapi.com/oilprice/index?key=51c97f482dec8bbdccb2fb79d80a53bf&code=wti&address="+add+"" //请求链接
        "method": "get", //请求方法
        "dataType": "json", //这里接口直接返回文本，所以不需要指定json类型数据
    })
	var data='';
    if(content.code == 250) {
        data ="油价查询失败,仅能查询省份油价" //请求失败时，返回的文字
    }else if(content.code == 200){
		var list = content.newslist[0];
		data ="查询地区:" +list.prov+"\n零号柴油：" + list.p0 +"\n89号汽油：" +  list.p89 + "\n92号汽油："+ list.p92+"\n95号汽油："+ list.p95+"\n98号汽油："+ list.p98+"\n更新时间："+ list.time
	}else{
		data="油价接口异常。"//接口异常，返回的文字
	}
	sendText(data)
}

main()
