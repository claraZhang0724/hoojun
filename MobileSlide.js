function MobileSlide(options) {
	this.el = options.el; //需要操作的容器
	this.max = options.data.length;//定义轮播图的元数据长度、轮播图的个数
	this.data = options.data;//定义轮播图的元数据
	this.TouchStart = options.touchStart;//定义开始点击的回调
	this.RenderEnd = options.renderEnd;//定义渲染结束的回调
	this.onListClick = options.onListClick;//定义视图点击的回调
	this.parent = this.el.parentNode;//定义父元素用于增加工具
	this.viewWidth = this.parent.offsetWidth;//定义视图的可视宽度
	this.beforeView = options.beforeView;
	this.activeView = options.activeView;
	this.afterView = options.afterView;
    this.position = {//关于定位 起始位置，结束位置，触摸类型（上下左右）
        xStart: 0,
        yStart: 0,
        xEnd: 0,
        yEnd: 0,
        typeX: null,
        typeY: null
    }
	if (this.max > 1) {
		options.showTool && this.createTools();
		if (options.autoPlay) {
			var _this = this;
			_this.isAutoPlay = true;
			_this.autoTime = (options.autoPlay == true || options.autoPlay<2000) ?
				2000 : options.autoPlay;
			_this.autoPlayTimer = setTimeout(function () { 
				_this.autoPlay(_this.autoTime);
			}, _this.autoTime);
		}
		this.init();
	}
	this.render();
}
MobileSlide.prototype = {
	handleEvent: function (e) {
    	if(this.isrender){
			return;
		}
        switch (e.type) {
            case 'touchstart': this.onTouchStart(e); break;
            case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
            default: break;
        }
    },
	init: function () {
		this.index = 0;
		this.isrender = false;
		this.el.addEventListener('touchstart', this, {passive:true});
		this.el.addEventListener('touchmove', this, {passive:true});
		this.el.addEventListener('touchend', this, {passive:true});
		this.timer = null;
	},
	//自动播放
	autoPlay: function (time) {
		var _this = this;
		_this.index++;
		_this.index >= _this.max && (_this.index = 0);
		_this.position.typeX = "left";
		_this.isrender = true;
		_this.renderBefore();
		_this.autoPlayTimer = setTimeout(function () { 
			_this.autoPlay(time);
			_this = null;
		}, time);
	},
	//创建工具
    createTools:function(){
    	var position = getComputedStyle(this.parent).position;
    	var _this = this;
    	if(position=="static"){
    		_this.parent.style.position = "relative";
    	}
    	var div = document.createElement('div');
    		div.className = "ms-tools-box";
    	var str = ['<ul class="ms-tools clear">'];
		for (var i = 0; i < _this.max; i++){
			i == 0 ? str.push('<li class="ms-tools-bar active" data-index="0"></li>')
				:str.push('<li class="ms-tools-bar" data-index="' + i + '"></li>');
    	}
    	str.push('</ul>');
    	div.innerHTML = str.join("");
		_this.parent.appendChild(div);
		_this = null;
		div = null;
		str = null;
	},
	//开始触摸
	onTouchStart: function (e) {
		this.touchModel = 'click';
		this.autoPlayTimer && clearTimeout(this.autoPlayTimer);
		this.isClearTiout = true;
        this.position.xStart = e.touches[0].pageX,
		this.position.yStart = e.touches[0].pageY;
		this.TouchStart.call(this, e);
	},
	//滑动
    onTouchMove: function (e) {
		e.stopPropagation();
		this.touchModel = 'scroll';
        this.position.xEnd = e.touches[0].pageX;
		this.position.yEnd = e.touches[0].pageY;
		//left or right
		e.touches[0].pageX > this.position.xStart ?
			(this.position.typeX = "right")
			: (this.position.typeX = "left");
		//up or down
		e.touches[0].pageY > this.position.yStart ?
			(this.position.typeY = "down")
			: (this.position.typeY = "up");
        var tramslateX = (e.touches[0].pageX - this.position.xStart) - this.viewWidth;
		this.el.style.transform = "translate3d(" + tramslateX + "px,0,0)";
		tramslateX = null;
	},
	//触摸结束
    onTouchEnd: function (e) {
    	this.isrender = true;
		var _this = this;
		if (_this.touchModel == 'click') {
			_this.onListClick.call(_this, e);
			_this.reloadTimeout();
			_this.isrender = false;
			return;
		}
    	switch(_this.position.typeX){
    		case 'right':
    			_this.index--;
    			_this.index<0 && (_this.index = _this.max - 1);
    			break;
    		case 'left':
				_this.index++;
				_this.index >= _this.max && (_this.index = 0);
    			break;
    	}
		_this.renderBefore();
		_this = null;
	},
	//渲染前置方法
	renderBefore: function () {
		var _this = this;
		_this.position.typeX == "right" ?
			(_this.el.style.cssText = "transition:transform .2s;transform:translate3d(0,0,0)")
			: (_this.el.style.cssText = "transition:transform .2s;transform:translate3d(-" + _this.viewWidth * 2 + "px,0,0)");
		_this.timer = setTimeout(function(){
    		_this.render();
    		_this = null;
    	},200);
	},
	//开始渲染
    render:function(){
		this.el.style.cssText = "transform:translate3d(-"+this.viewWidth+"px,0,0)";
		this.RenderEnd.call(this,{
			before: this.data[this.index-1]||this.data[this.max-1],
			active: this.data[this.index]||this.data[0],
			after: this.data[this.index+1]||this.data[0]
		});
		this.isrender = false;
		var tbara = this.parent.querySelector('.ms-tools-bar.active');
		var tbar = this.parent.querySelectorAll('.ms-tools-bar');
		tbara && tbara.classList.remove('active');
		tbar[0] && tbar[this.index].classList.add('active');
		this.timer && clearTimeout(this.timer);
		this.reloadTimeout();
		tbara = null;
		tbar = null;
	},
	//重置自动播放定时器 
	reloadTimeout: function () {
		if (this.isClearTiout && this.isAutoPlay) {
			var _this = this;
			_this.isClearTiout = false;
			_this.touchModel = null;
			_this.autoPlayTimer = setTimeout(function () { 
				_this.autoPlay(_this.autoTime);
				_this = null;
			}, _this.autoTime);
		}
	}
}