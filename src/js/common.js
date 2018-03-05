var require = {
	baseUrl: 'js/',
	paths: {
		q: 'lib/q.min',
		md5: 'lib/md5.min',
		mustache: 'lib/mustache.min',
		mine: 'lib/mine',
		jquery: 'lib/jquery.min',
		bootstrap: 'lib/bootstrap.min',
		adminlte: 'lib/adminlte.min',
		pager: 'lib/pager',
		mui: 'lib/mui.min'

	},
	shim: {　　　　
		q: {
			exports: 'Q'
		},
		md5: {
			exports: 'md5'
		},
		mustache: {
			deps: ["jquery"],
			exports: 'mustache'
		},
		mine: {
			exports: 'mine'
		},
		jquery: {
			exports: 'jquery'
		},
		bootstrap: {
			deps: ["jquery"],
			exports: 'bootstrap'
		},
		adminlte: {
			deps: ["jquery"],
			exports: 'adminlte'
		},
		pager: {
			exports: 'pager'
		},
		mui: {
			exports: 'mui'
		}
	},
	waitSeconds: 0
};

// var urlBase = "http://192.168.31.13:12345/school";
var urlBase = "http://192.168.1.108:12345/school";
//var urlBase = "http://www.rainrain.xin:12345/school";
var size = 2;
var page = 0;
var pageSize = 10;
var time;
//var delwithNum;

var ERROR = {
	FILE_INVALID: 1,
	INVALID_PARAMS: 2
}

//判断手机号格式

function checkMobile(mobile) {
    if(!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(mobile))) {
        mui.alert('手机号格式不正确');
        return false;
    } else {
        return true;
    }
}

//时间戳转时间
function formatDate(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

//禁止浏览器后退和前进
function advanceAndRetreat() {
	if(window.history && window.history.pushState) {
		// 当点击浏览器的 后退和前进按钮 时才会被触发， 
		$(window).on('popstate', function() {　　　　　　　　　　　　　　　　
			window.history.pushState('forward', null, '');
			window.history.forward(1);
		});
	}　　
	//	在IE中必须得有这两行　　　　　　　
	window.history.pushState('forward', null, '');
	window.history.forward(1);
}
//	显示当前的用户
function showCurrentUser() {
	$('.currentUser').text(window.localStorage.username);
	$('.currentRole').text(window.localStorage.role);

}
//	退出操作
function signOut() {
	window.localStorage.clear();
	window.location.href = "index.html";
}

//	任务列表状态
function taskStatus(status) {
	var statusText;
	switch(status) {
		case 1:
			statusText = '待接受';
			break;
		case 2:
			statusText = '已接受';
			break;
		case 3:
			statusText = '已完成';
			break;
	}
	return statusText;
}





//光交箱状态
//1-占用 2-空闲 3-损坏
function boxStatus(status) {
	var statusText;
	switch(status) {
		case 1:
			statusText = '占用';
			break;
		case 2:
			statusText = '空闲';
			break;
		case 3:
			statusText = '损坏';
			break;
	}
	return statusText;
}
//	智能锁状态
//1-可用，2-禁用
function unlockingStatus(status) {
	var statusText;
	switch(status) {
		case 1:
			statusText = '可用';
			break;
		case 2:
			statusText = '禁用';
			break;

	}
	return statusText;
}

//智能锁开锁状态
//1-开门成功，2-开门失败, 3-非法开门(报警)
function openDoorStatus(status) {
	var statusText;
	switch(status) {
		case 1:
			statusText = '开门成功';
			break;
		case 2:
			statusText = '门已关闭';
			break;
		case 3:
			statusText = '非法开门';
			break;
		case 4:
			statusText = '开门失败';
			break;

	}
	return statusText;
}

//返回上一页并刷新
function goBackLast() {
	window.history.back();
	location.reload();
}

//	url 传参解密
function getURLParameter() {
	var getInfo = decodeURIComponent(window.location.search).slice(window.location.search.lastIndexOf("?") + 1);
	return getInfo;
}
//	
function getBodyHeight() {
	var minHeight = $(document).height() - $('.navbar').height() - 1;
	$('.content-wrapper').attr('style', "min-height:" + minHeight + "px;");
}

//	获取验证码倒计时实现
var sec = 58;
var intervalid;

function runTime() {
	if(sec == 0) {
		sec = 58;
		document.querySelector('.get-time').innerHTML = "59秒";
		document.querySelector('.get-time').classList.add('mui-hidden');
		document.querySelector('.get-smscode').classList.remove('mui-hidden');
		clearInterval(intervalid);
	} else {
		document.querySelector('.get-time').innerHTML = sec-- + "秒";
	}

}

//	开启倒计时
function openRunTime() {
	document.querySelector('.get-smscode').classList.add('mui-hidden');
	document.querySelector('.get-time').classList.remove('mui-hidden');
	intervalid = setInterval(runTime, 1000);
}

//	关闭倒计时
function closeRunTime() {
	sec = 58;
	document.querySelector('.get-time').innerHTML = "59秒";
	document.querySelector('.get-smscode').classList.remove('mui-hidden');
	document.querySelector('.get-time').classList.add('mui-hidden');
	clearInterval(intervalid);
}

//	数据不为空时隐藏提示，禁用上拉加载
function dataHaveHidden(id) {
	console.log(id);
	document.querySelector('.search-result').classList.add('mui-hidden');
	mui(id).pullRefresh().enablePullupToRefresh();
}

function getPulldownOptions(callback, auto) {
	return {
		height: 50,
		auto: auto,
		contentdown: "下拉可以刷新",
		contentover: "释放立即刷新",
		contentrefresh: "正在刷新...",
		callback: callback
	}
}

function getPullupOptions(callback) {
	return {
		contentrefresh: "正在加载...",
		contentnomore: '没有更多数据了',
		callback: callback
	}
}

function statusHandler(status) {
	console.log('statusHandler(' + status + ')');
	plus.nativeUI.closeWaiting();

	switch(status) {
		case 0:
			mui.alert('网络问题，请稍后再试');
			break;
		case ERROR.FILE_INVALID:
			mui.alert('无效的文件');
			break;
		case ERROR.INVALID_PARAMS:
			mui.alert('无效的参数');
			break;
		case 204:
			mui.alert('没有内容，请稍候再试');
			break;
		case 401:
			mui.alert('没有权限，请联系客服');
			break;
		case 403:
			mui.alert('越权操作，请联系客服');
			break;
		case 404:
			mui.alert('请求地址错误，请联系客服');
			break;
		case 500:
			mui.alert('服务器出错啦，请稍候再试');
			break;
		default:
			mui.alert('未知错误，错误代码[' + status + ']');
	}
}


//设置光标位置函数 
function setCursorPosition(ctrl, pos) {
	if(ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos, pos);
	} else if(ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

//	实时动态强制更改用户录入金额
function amount(th) {
	var regStrs = [
		['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0  
		['[^\\d\\.]+$', ''], //禁止录入任何非数字和点  
		['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点  
		['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上  
	];
	for(var i = 0; i < regStrs.length; i++) {
		var reg = new RegExp(regStrs[i][0]);
		th.value = th.value.replace(reg, regStrs[i][1]);
	}
}

//	录入完成后，输入模式失去焦点后对录入进行判断并强制更改，并对小数点进行0补全  
function overFormat(th) {
	var v = th.value;
	if(v === '0') {
		v = '0.00';
	} else if(v === '0.') {
		v = '0.00';
	} else if(/^0+\d+\.?\d*.*$/.test(v)) {
		v = v.replace(/^0+(\d+\.?\d*).*$/, '$1');
		v = inp.getRightPriceFormat(v).val;
	} else if(/^0\.\d$/.test(v)) {
		v = v + '0';
	} else if(!/^\d+\.\d{2}$/.test(v)) {
		if(/^\d+\.\d{2}.+/.test(v)) {
			v = v.replace(/^(\d+\.\d{2}).*$/, '$1');
		} else if(/^\d+$/.test(v)) {
			v = v + '.00';
		} else if(/^\d+\.$/.test(v)) {
			v = v + '00';
		} else if(/^\d+\.\d$/.test(v)) {
			v = v + '0';
		} else if(/^[^\d]+\d+\.?\d*$/.test(v)) {
			v = v.replace(/^[^\d]+(\d+\.?\d*)$/, '$1');
		} else if(/\d+/.test(v)) {
			v = v.replace(/^[^\d]*(\d+\.?\d*).*$/, '$1');
			ty = false;
		} else if(/^0+\d+\.?\d*$/.test(v)) {
			v = v.replace(/^0+(\d+\.?\d*)$/, '$1');
			ty = false;
		} else {
			v = '0.00';
		}
	}
	th.value = v;
}

//	textarea禁止换行
function checkEnter(e) {
	var et = e || window.event;
	var keycode = et.charCode || et.keyCode;
	if(keycode == 13) {
		if(window.event)
			window.event.returnValue = false;
		else
			e.preventDefault(); //for firefox
	}
}


//	返回当前时间戳
function currentTime() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	var currentdate = year + "/" + month + "/" + date + " " + hour + ":" + minute;
	var date = new Date(currentdate);
	currentdate = date.getTime();
	return currentdate;
}
//  获得当前时间
function NowTimer() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	var currentdate = year + month + date;
	return currentdate;
}

//  获得明天时间
function tomorrowTimer() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate() + 1;
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	var tomorrowTimer = year + "-" + month + "-" + date;
	return tomorrowTimer;
}

//时间戳转时间
function formatDay(timestamp) {
	timestamp = new Date(timestamp);
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	return year + "-" + month + "-" + date
}

function currentShortTime() {
	var timestamp = new Date();
	var year = timestamp.getFullYear();
	var month = timestamp.getMonth() + 1;
	var date = timestamp.getDate();
	var hour = timestamp.getHours();
	var minute = timestamp.getMinutes();
	var second = timestamp.getSeconds();
	if(month < 10) {
		month = '0' + month;
	}
	if(date < 10) {
		date = '0' + date;
	}
	if(hour < 10) {
		hour = '0' + hour;
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	if(second < 10) {
		second = '0' + second;
	}
	var currentdate = year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
	var date = new Date(currentdate);
	currentdate = date.getTime();
	return currentdate;
}

//JavaScript判断数组是否包含指定元素的方法
Array.prototype.contains = function(needle) {
	for(i in this) {
		if(this[i] == needle) return true;
	}
	return false;
}
//	求两个数组的不相同元素
function ArrydifferentE(a, b) {
	var  c  =   [];
	var  tmp  =  a.concat(b);
	var  o  =   {};
	for (var  i  =  0;  i  <  tmp.length;  i ++) (tmp[i]  in  o)  ?  o[tmp[i]] ++  :  o[tmp[i]]  =  1;
	for (x  in  o) 
		if (o[x]  ==  1)  c.push(x);
	return(c);
}

