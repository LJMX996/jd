async function unsubscribeCartsFun(jd_env) {
  let $ = jd_env, allMessage;
  const cookie = $.cookie;
  return new Promise((resolve) => {
    const options = {
      url: `https://wq.jd.com/deal/mshopcart/rmvCmdy?sceneval=2&g_login_type=1&g_ty=ajax`,
      body: `pingouchannel=0&commlist=${$.commlist}&type=0&checked=0&locationid=${$.areaId}&templete=1&reg=1&scene=0&version=20190418&traceid=${$.traceId}&tabMenuType=1&sceneval=2`,
      headers: {
        Accept: "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        Connection: "keep-alive",
        Cookie: cookie,
        Referer: "https://p.m.jd.com/",
        "User-Agent": $.isNode()
          ? process.env.JD_USER_AGENT
            ? process.env.JD_USER_AGENT
            : require("../USER_AGENTS").USER_AGENT
          : $.getdata("JDUA")
          ? $.getdata("JDUA")
          : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
      },
    };
    $.post(options, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data["errId"] == "0") {
          allMessage += `删除成功：\n`;
        } else {
          allMessage += `删除失败：\n`;
        }
      } catch (e) {
        allMessage += `删除结果：\n`;
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  });
}

async function getCarts(jd_env) {
  let $ = jd_env;
  const cookie = $.cookie;
  $.shopsTotalNum = 0;
  return new Promise((resolve) => {
    const option = {
      url: `https://p.m.jd.com/cart/cart.action`,
      headers: {
        Host: "p.m.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: cookie,
        "User-Agent": $.isNode()
          ? process.env.JD_USER_AGENT
            ? process.env.JD_USER_AGENT
            : require("../USER_AGENTS").USER_AGENT
          : $.getdata("JDUA")
          ? $.getdata("JDUA")
          : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
      },
    };
    $.get(option, (err, resp, data) => {
      try {
        data = JSON.parse(getStr(data, "window.cartData =", "window._PFM_TIMING"));
        $.cartsTotalNum = 0;
        if (data.errId === "0") {
          $.traceId = data["traceId"];
          $.areaId = data["areaId"];
          let itemId, skuId, index, temp;
          $.commlist = "";
          for (let i = 0; i < data["cart"]["venderCart"].length; i++) {
            const vender = data["cart"]["venderCart"][i];
            for (let s = 0; s < vender["sortedItems"].length; s++) {
              const sorted = vender["sortedItems"][s];
              itemId = sorted.itemId;
              for (let m = 0; m < sorted["polyItem"]["products"].length; m++) {
                const products = sorted["polyItem"]["products"][m];
                if (itemId == products["mainSku"]["id"]) {
                  skuId = "";
                  index = "1";
                } else {
                  skuId = itemId;
                  index = sorted["polyType"] == "4" ? "13" : "11";
                }
                if ($.skuIds.includes(products["mainSku"]["id"]) || process.env.CLEAR_SHOPPING_CART) {
                  temp = [products["mainSku"]["id"], , "1", products["mainSku"]["id"], index, skuId, "0", "skuUuid:" + products["skuUuid"] + "@@useUuid:" + products["useUuid"]].join(",");
                  if ($.commlist.length > 0) {
                    $.commlist += "$";
                  }
                  $.commlist += temp;
                }
                $.cartsTotalNum += 1;
              }
            }
          }
          if ($.commlist.length > 0) {
            $.commlist = encodeURIComponent($.commlist);
          }
          console.log(`当前购物车商品数：${$.cartsTotalNum}个\n`);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve($);
      }
    });
  });
}

function getStr(text, start, end) {
  var str = text;
  var aPos = str.indexOf(start);
  if (aPos < 0) {
    return null;
  }
  var bPos = str.indexOf(end, aPos + start.length);
  if (bPos < 0) {
    return null;
  }
  var retstr = str.substr(aPos + start.length, text.length - (aPos + start.length) - (text.length - bPos));
  return retstr;
}

exports.getCarts = getCarts;
exports.unsubscribeCartsFun = unsubscribeCartsFun;