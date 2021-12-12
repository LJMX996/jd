 // [rule: 影视 ?]
 
 var content=request({ url: "http://hm.suol.cc/API/dy.php?msg=" + encodeURI(param(1)) + "&n=1" })
content = content.replace(/\$\$\$/g, "\n链接2：").replace(/链接2：.*/g, "").replace(/\$/g, "").replace(/图片.*/g, "").replace(/.*m3u8/g, "??").replace(/\?\?.*/g, "")
sendText(content)
