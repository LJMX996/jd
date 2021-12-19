//[rule: google ?]
//[rule: gg ?]
//[rule: 谷歌 ?]

function main() {
     var keyword = param(1)
     var data = request({
          method: 'GET',
          url: 'https://google-search3.p.rapidapi.com/api/v1/search/q=' + encodeURI(keyword) + '&num=100',
          useProxy: false,//使用代理，自动调用tg代理
          dataType: "json",
          headers: {
               'x-user-agent': 'desktop',
               'x-proxy-location': 'US',
               'x-rapidapi-host': 'google-search3.p.rapidapi.com',
               'x-rapidapi-key': '8d40762ea9mshf4a385667fa7934p121275jsn5894213ce483'//需要自己去申请，https://rapidapi.com/apigeek/api/google-search3/
          }

     })
     if (!data.total) {
          return "找不到" + keyword + "相关结果。"
     }
     sendText("找到" + data.total + "个结果，回复“n”将依次为你展示。")
     while (input() == "n") {
          var result = data.results.shift()
          sendText("标题：" + result.title + "\n" + "内容：" + result.description + "\n" + "链接：" + result.link)
     }
}

main()