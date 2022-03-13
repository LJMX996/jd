// [rule: ?转]
function main() {
    var input1 = param(1)
    var data = request({ url: "http://jd.zack.xin/sms/jd/api/ulink.php?type=hy&url="+input1, dataType: "json" }).code;
    sendText(data) }
main()