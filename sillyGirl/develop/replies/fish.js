// [rule: 摸鱼] 
/* 
 *@author:  Mol
 *@create: 2021-11-24-20/20-20
 */
var fishMan = new Date();
var year = fishMan.getFullYear();
var month = fishMan.getMonth();
var day = fishMan.getDate();
var hour = fishMan.getHours();
var item = fishMan.getDay()
var msg = '';

function main() {
	headInfo();
	weekend();
	festival('元旦', 1, 1);
	festival('春节', 2, 1);
	festival('五一', 5, 1);
	festival('端午', 6, 3);
	festival('国庆', 10, 1);
	lastInfo();
	sendText(msg)
 }
 
 function headInfo() {
	var mae = ''
	if (hour >= 6 && hour < 12) {
		mae = '上午'
	} else if (hour >= 12 && hour < 18) {
		mae = '下午'
	} else if ((hour >= 18 && hour < 24) || hour < 6) {
		mae = '晚上'
	}
	var info = "【摸鱼办】提醒您："+month+"月"+day+"日,"+mae+"好,摸鱼人！\n工作再累，一定不要忘记摸鱼哦！有事没事起身去茶水间， 去厕所， 去廊道走走别老在工位上坐着， 钱是老板的, 但命是自己的!\n"
	msg += info
	return info
}
 
 function lastInfo() {
	var info = "上班是帮老板赚钱，摸鱼是赚老板的钱！最后，祝愿天下所有摸鱼人，都能愉快的渡过每一天…\n​"
	msg += info
	return info
}
 
 function weekend(){
	var item = fishMan.getDay()
	var info = ""
	if (item > 0 && item <= 5) {
		item = 6 - item
		info = "距离周末还有"+item+"天\n";
	} else {
		info = '好好享受周末吧\n';
	}
	msg += info
	return info
}
 
 function festival(chinese, fmonth, fday) {
	var startDate = Date.parse(fishMan);
	var info = "";
	var newfestival = new Date(year + 1, fmonth , fday );
	var endDate = Date.parse(newfestival);
	var days = Math.round((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
	if (month == fmonth && day == fday) {
		info = "今天就是"+chinese+"节，好好享受！\n"
	} else {
		info = "距离"+chinese+"节还有"+days+"天\n"
	}
	msg +=	info
	return info
}
 
 main()