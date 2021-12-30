// [rule: epic]
// [rule: Epic]
// [cron: 30 11 * * *]

request('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN', function (error,response, body) {

    var data = JSON.parse(body)
    var games = data.data.Catalog.searchStore.elements

    var freeGame = games[games.length - 1]
    var title = freeGame.title
    var desp = freeGame.description
    var coverImg = freeGame.keyImages[1].url
    var shopUrl = "https://www.epicgames.com/store/zh-CN/p/" + freeGame.productSlug

    sendText("今日限免：" + title + "\n" + desp + "\n" + "领取地址：" + shopUrl + image(coverImg))
})
