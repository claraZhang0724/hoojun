function $id(s) {
	return document.getElementById(s);
}
function $(s,fa) {
	return (fa && fa.querySelectorAll(s))||document.querySelectorAll(s);
}

var viewDom = $('.view');

for (var i = 0, vh = viewDom.length; i < vh; i++){
	var _active = viewDom[i];
	var jsonData = _active.querySelectorAll('li img');
	var options = {
		afterView: _active.querySelector('.scroll-after'),//之后的试图
		beforeView: _active.querySelector('.scroll-before'),//当前的试图
		activeView: _active.querySelector('.scroll-active'),//之前的试图
		el: _active.querySelector('.scrollbody'),//视图的容器
		data:jsonData,//轮播图的初始数据
		showTool: true,//是否显示小点
		autoPlay: 2500,//自动播放时间默认2000
		touchStart: function (e) {
			//开始触摸的回调
		},
		onListClick: function (e) {
			//每一个视图点击之后
			console.log(e);
		},
		renderEnd: function (data) {
			//渲染结束以后 重置 前后和当前的dom
			this.beforeView.innerHTML = options.createTmp(data.before);
			this.activeView.innerHTML = options.createTmp(data.active);
			this.afterView.innerHTML = options.createTmp(data.after);
		},
		createTmp: function (data) {
			//创建每一个试图的html模版
			var str = '<img src="' + data.src + '">';
			return str;
		}
	}
	new MobileSlide(options);
	_active = null;
	jsonData = null;
}
