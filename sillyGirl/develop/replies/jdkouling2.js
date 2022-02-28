/*
 * @Author: 烟雨
 * @Date: 2022-02-13 18:11:48
 * @LastEditors: 烟雨
 * @LastEditTime: 2022-02-13 18:17:36
 * @FilePath: \undefinedc:\Users\Administrator\Desktop\转口令.js
 * @Description: 
 * 
 * Copyright (c) 2022 by 烟雨, All Rights Reserved. 
 */
//[rule:code ?]
//[rule:转口令 ?]
var code = param(1);
sendText("正在解析口令，请稍等片刻......")
var _data = {"code": code}
request({
    url: 'https://api.jds.codes/jd/jCommand',
    method: 'POST',
    dataType:'json',
    headers: {
        "content-type": "application/json",
    },
    body: _data
},function(err, resp, data) {
    if (!err && resp.statusCode == 200) {
     if(data){
      sendText(data.data.jumpUrl)}
    }else{
      sendText("网络请求失败："+data.msg)
     }
});