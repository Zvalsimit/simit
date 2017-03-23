function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}
var baseMap = {
	map : null,
	lmap : null,
	size : 12,
	city : '北京市',//默认城市
	adress : '',//选取地址
	input : null,//调用目标
	inputP : {},
	inputP1 : {},
	orderFrom : false,
	orderType : 0,//0,1,2 0 必须选取两点 计价 1 选取两点 必须有收货点 计价 2 选取两个点 不计价
	base : function(a,b,c,d,e){//绑定
		if(a){
			this.orderFrom = true;
			a.keydown(this.inputInit);
			a.siblings('.select_location').click(this.init);
		}
		b.keydown(this.inputInit1);
		b.siblings('.select_location').click(this.init1);
		c.click(this.sureMap);
		d.click(this.closeMap);
		this.demo();
		this.orderType = e?e:0;
	},
	init : function(){//选择
		baseMap.input = $(this).siblings('input');
		$(this).siblings('input').prop('ac',null);
		baseMap.index = 0;
		$('.layer').show();
		baseMap.searchMap();
	},
	init1 : function(){//选择
		baseMap.input = $(this).siblings('input');
		$(this).siblings('input').prop('ac',null);
		baseMap.index = 1;
		$('.layer').show();
		baseMap.searchMap();
	},
	inputInit : function(){
		var that = this;
		baseMap.input = $(this);
		if(!this.ac){
			this.ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{"input" : $(this).attr('id'),
				"location" : baseMap.city
			});
			this.ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
				var _value = e.item.value;
				baseMap.adress = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				var myGeo = new BMap.Geocoder();
				myGeo.getPoint(baseMap.adress, function(point){
					if (point) {
						baseMap.inputP = point;
						baseMap.inputP.text = baseMap.adress;
						loginPay.userInfo.supplier_lat = point.lat; 
						loginPay.userInfo.supplier_lng = point.lng;
						loginPay.userInfo.supplier_area = baseMap.inputP.text;
						that.ac.dispose();
						that.ac=null;
						baseMap.sureMap();
					}else{
						dialog.init("您选择地址没有解析到结果!");
					} 
				}, baseMap.city);
			});
		}else{
			return;
		}
	},
	inputInit1 : function(){
		var that = this;
		baseMap.input = $(this);
		if(!this.ac){
			this.ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{"input" : $(this).attr('id'),
				"location" : baseMap.city
			});
			this.ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
				var _value = e.item.value;
				baseMap.adress = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				var myGeo = new BMap.Geocoder();
				myGeo.getPoint(baseMap.adress, function(point){
					if (point) {
						baseMap.inputP1 = point;
						baseMap.inputP1.text = baseMap.adress;
						loginPay.userInfo.receiver_lat = point.lat; 
						loginPay.userInfo.receiver_lng = point.lng;
						loginPay.userInfo.receiver_area = baseMap.inputP1.text;
						that.ac.dispose();
						that.ac=null;
						baseMap.sureMap();
					}else{
						dialog.init("您选择地址没有解析到结果!");
					}
				}, baseMap.city);
			});
		}
	},
	demo : function(){//路线地图
		this.map = new BMap.Map("box_map");
		this.map.centerAndZoom(this.city, this.size);
	},
	moveCity : function(city){//定位成功移动城市
		this.city = city;
		this.map.centerAndZoom(this.city, this.size);
		if(this.lmap){
			this.lmap.centerAndZoom(this.city, this.size);
		}
	},
	render : function(a,b){//路线规划
		this.map.clearOverlays();
		var walking = new BMap.WalkingRoute(this.map, {renderOptions:{map: this.map, autoViewport: true}});
		walking.search(a,b);
	},
	searchMap : function(){//选择地址
		var that = this;
		if(!this.lmap){
			this.lmap = new BMap.Map("lmap");
			this.lmap.centerAndZoom(this.city,this.size);
			this.lmap.enableScrollWheelZoom();
			this.lmap.addEventListener("click",function(e){
				if(e.target.$g === that.city){
					that.lmap.clearOverlays(); 
					var new_point = new BMap.Point(e.point.lng,e.point.lat);
					var marker = new BMap.Marker(new_point);
					that.lmap.addOverlay(marker);
					var gc = new BMap.Geocoder(); 
					gc.getLocation(new_point, function(rs) {
						var addComp = rs.addressComponents;
						var mapAddress = addComp.province+addComp.city + addComp.district + addComp.street + addComp.streetNumber;
						$("#suggestId").val(mapAddress);
						if(baseMap.index){
							baseMap.inputP1 = new_point;
							baseMap.inputP1.text = baseMap.adress = mapAddress;
							loginPay.userInfo.receiver_lat = baseMap.inputP1.lat; 
							loginPay.userInfo.receiver_lng = baseMap.inputP1.lng;
							loginPay.userInfo.receiver_area = baseMap.inputP1.text;
						}else{
							baseMap.inputP = new_point;
							baseMap.inputP.text = baseMap.adress = mapAddress;
							loginPay.userInfo.supplier_lat = baseMap.inputP.lat; 
							loginPay.userInfo.supplier_lng = baseMap.inputP.lng;
							loginPay.userInfo.supplier_area = baseMap.inputP.text;
						}
					});
				}else{
					dialog.init("未在分站服务区域");
				}
			});
			var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{"input" : "suggestId",
				"location" : this.city
			});
			ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			var _value = e.item.value;
				baseMap.adress = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				setPlace();
			});
			function setPlace(){
				that.lmap.clearOverlays();    //清除地图上所有覆盖物
				function myFun(){
					var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
					that.lmap.centerAndZoom(pp, 18);
					that.lmap.addOverlay(new BMap.Marker(pp));    //添加标注
					if(baseMap.index){
						baseMap.inputP1 = pp;
						baseMap.inputP1.text = baseMap.adress;
						loginPay.userInfo.receiver_lat = baseMap.inputP1.lat; 
						loginPay.userInfo.receiver_lng = baseMap.inputP1.lng;
						loginPay.userInfo.receiver_area = baseMap.inputP1.text;
					}else{
						baseMap.inputP = pp;
						baseMap.inputP.text = baseMap.adress;
						loginPay.userInfo.supplier_lat = baseMap.inputP.lat; 
						loginPay.userInfo.supplier_lng = baseMap.inputP.lng;
						loginPay.userInfo.supplier_area = baseMap.inputP.text;
					}
				}
				var local = new BMap.LocalSearch(that.lmap, { //智能搜索
				  onSearchComplete: myFun
				});
				local.search(baseMap.adress);
			}
		}
	},
	sureMap : function(){//确定地址
		if(baseMap.orderType===0&&baseMap.inputP.lat&&baseMap.inputP1.lat){
			loginPay.getFee(baseMap.city);
			baseMap.render(baseMap.inputP,baseMap.inputP1);
		}else if(baseMap.orderType===1&&baseMap.inputP.lat&&baseMap.inputP1.lat){
			loginPay.getFee(baseMap.city);
			baseMap.render(baseMap.inputP,baseMap.inputP1);
		}else if(baseMap.orderType===1&&!baseMap.inputP.lat&&baseMap.inputP1.lat){
			loginPay.getFee(baseMap.city);
			baseMap.render(baseMap.inputP1,baseMap.inputP1);
		}else if(baseMap.orderType===2&&baseMap.inputP.lat&&baseMap.inputP1.lat){
			baseMap.render(baseMap.inputP,baseMap.inputP1);
		}else if(baseMap.orderType===2&&!baseMap.inputP.lat&&baseMap.inputP1.lat){
			baseMap.render(baseMap.inputP1,baseMap.inputP1);
		}
		if(baseMap.adress){
			baseMap.input.val(baseMap.adress);
		}else{
			return false;
		}
		baseMap.closeMap();
	},
	closeMap : function(){//取消地址选择
		$('.layer').hide();
		baseMap.adress = '';
		$("#suggestId").val('');
		baseMap.lmap.reset();
	},
};
var loginPay = {
	status : '',
	userInfo : {
		base : false,
		device: 'pc',
		order_source: 'pc',
		user_id: '',
		mobile: '',
		order_city: '',
		group_id: 100017,
		sid: '',
		order_info: '',
		receiver_phone: '',
		supplier_phone: '',
		supplier_address: '',
		receiver_address: '',
		receiver_area: '',
		supplier_area: '',
		supplier_lat: 0,
		supplier_lng: 0,
		receiver_lat: 0,
		receiver_lng: 0,
		expected_time: '',
		order_fee: 0,
		order_expense: 0,
		all_expense: 0,
		order_category: '',
		order_weight: '',
		order_extend_info: '',
		ship_distance: 0,
		order_type: 0,
		pay_channels: null,
		pay_channel:'wx',
		coupon_amount : 0,
		coupon_id : '',
		car_flag : 0,
		price : 0,
		pay : null
	},
	clas : {
		1009 : '帮我买',
		1011 : '帮我送',
		1192 : '帮我办',
		1223 : '当日达',
	},
	getCityList : function(city){
		var that = this;
        var params = {
                city : city,
            }
        $.post('/flow/v1_0/group/getGroupList',params,function(data){
            if(typeof data === 'string'){
                data = JSON.parse(data);
            }
            if(data.respcd == '0000'&&data.data.group_id){
				local.success(city);
				that.userInfo.group_id = data.data.group_id;
			}else{
				dialog.init('当前城市暂未开通')
			}
        });            
    },
	ajax : function(index){
		var that = this;
		that.userInfo.order_type = index;
		that.userInfo.order_info = that.clas[index];
        loginPay.userInfo.sid = decodeQuery()['sid'];
		if(loginPay.userInfo.sid==100818){
			loginPay.userInfo.order_source = 'bd_pc';
		}
		//筛选
		switch(index){
			case 1192 : this.getUserMenuPc();
			break;
			case 1223 : this.getPrice();
		}
		try{
			if(sessionStorage.login){
				that.userInfo.base = true;
				$(".login_box").eq(0).addClass('fade');
				$(".login_box").eq(1).removeClass('fade');
				that.getAuxiliaryInfo();
				return;
			}
		}catch(e){
		}
		//图像验证
		$.ajax({
			// 获取id，challenge，success（是否启用failback）
			url: "/flow/v1_0/user/verifycode",
			type: "post",
			dataType: "json",
			success: function (data) {
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}
				if(data.data.gt_status === 1){
					var data_gt = JSON.parse(data.data.gt_response_str);
					that.status = data.data.gt_status;
					initGeetest({
						gt: data_gt.gt,
						challenge: data_gt.challenge,
						product: "popup", 
						offline: !data_gt.success 
					}, that.handlerPopup);
				}else{
					dialog.init(data.resperr);
				}
			}
		});
	},
	handlerPopup : function (captchaObj) {
		$("#validate").click(function(){
			var validate = captchaObj.getValidate();
			if (!validate) {
				dialog.init('请先完成验证！');
				return;
			}
			loginPay.getcaptcha(loginPay.status,validate.geetest_challenge,validate.geetest_validate,validate.geetest_seccode);
		});
		// 弹出式需要绑定触发验证码弹出按钮
		captchaObj.bindOn("#validate");
		// 将验证码加到id为captcha的元素里
		captchaObj.appendTo("#popup");
	},
	//物品种类
	active : function(ob,clas){
		this.userInfo.order_info += ob.eq(0).text();
		ob.click(function(){
			ob.removeClass(clas);
			$(this).addClass(clas);
			loginPay.userInfo.order_info = loginPay.userInfo.order_info.substr(0,3) + $(this).text();
		})
	},
	//短信发送
	getcaptcha : function (gt_status,challenge,validate,seccode) {
		var that = this;
        var telnum = $("#acode_mobile").val();
        if (!verify.phone($("#acode_mobile"))) {
            dialog.init("请输入正确手机号");
            return;
        }
        var params = {
            mobile: telnum,
			gt_status : gt_status,
			geetest_challenge : challenge,
			geetest_validate : validate,
			geetest_seccode : seccode,
			device : 'pc'
        };      
        //调接口获取短信验证码
        $.post("/flow/v1_0/user/smscode", params, function (resp) {
            if (typeof resp === 'string') {
                resp = JSON.parse(resp);
            }
            if (resp.respcd === '0000') {
				that.sendError();
            }else{
                dialog.init(resp.resperr);
            }
        });
    },
	sendError : function(){
        var num = 60;
		$('#abutton').attr('disabled','disabled');
		$('#abutton').css('color','#bcbcbc');
        var t = setInterval(function(){
            num--;
            $('#abutton').html(num+" s后重新发送");            
            if(num === 0){
                clearInterval(t);
                $('#abutton').html("获取验证码");
				$('#abutton').removeAttr('disabled');
				$('#abutton').css('color','#1EA853');
            }
        }, 1000);
    },
	//登录
	login : function(){
		var that = this,
		telnum = $("#acode_mobile").val(),code = $("#acode").val();
	    var params = {
			mobile: telnum,
			verifycode: code,
			openid: '',
	        group_id: '',
	    };
		//提交确认
	    $.post("/flow/v1_1/user/login", params, function (resp) {
			if (typeof resp === 'string') {
				resp = JSON.parse(resp);
			}
			if (resp.respcd === '0000') {
				try{
					sessionStorage.login = true;
				}catch(e){
				}
				that.userInfo.base = true;
				$(".login_box").eq(0).addClass('fade');
				$(".login_box").eq(1).removeClass('fade');
				that.getAuxiliaryInfo();
            }else{
				dialog.init(resp.resperr);
				return;
			}
	    });
	},
	//计费
	getFee : function(c){
		var that = this;
		this.userInfo.city = this.userInfo.order_city = c;
		var params = {
			supplier_lat: this.userInfo.supplier_lat, 
			supplier_lng: this.userInfo.supplier_lng,
			receiver_lat: this.userInfo.receiver_lat, 
			receiver_lng: this.userInfo.receiver_lng,
			user_id: this.userInfo.user_id,
			city: c,
			order_type: this.userInfo.order_type,
			car_flag : this.userInfo.car_flag
		};
		$.ajax({
			type: 'POST',
			url:'/flow/v1_0/price/getServicePrice',
			data: params,
			async: true,
			success: function(data) {
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}                    
				if (data.respcd === "0000") {
					that.userInfo.order_expense = data.data.ship_expense;
					that.userInfo.ship_distance = data.data.distance;
					that.userInfo.all_expense = data.data.ship_expense + that.userInfo.order_fee - that.userInfo.coupon_amount;
					$("#paotui_fee").text(that.userInfo.order_expense);
					$("#distance").text(data.data.distance);
					$("#order_expense").text(that.userInfo.order_expense + that.userInfo.order_fee);
					$("#all_expense").text(that.userInfo.all_expense);
				}
			}
		});
	},
	getPrice : function(){
		var that = this;
        var params = {
            group_id: this.userInfo.group_id,
            supplier_lat: 0, 
            supplier_lng: 0,
            receiver_lat: 0, 
            receiver_lng: 0,
            city: this.userInfo.city,
			user_id: this.userInfo.user_id,
            order_type:	this.userInfo.order_type,
            skill_type:0,
            price_type:5,
			car_flag : this.userInfo.car_flag
        };
        $.ajax({
            type: 'POST',
            url:'/flow/v1_0/price/getServicePrice',
            data: params,
            async: true,
            success: function(data) {
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }            
                if (data.respcd === "0000") {
                    var str = '',res = data.data.item_list;
					if(res.length>1){
						for(var i=0;i<res.length;i++){
							str += i===0?'<a class="address_range active" title="'+ res[i].title +'" data-val="'+res[i].price+'">'+res[i].title+'</a>':'<a class="address_range" data-val="'+res[i].price+'">'+res[i].title+'</a>';
						}
					}else{
						str = '<a class="address_range active" title="'+ res[0].title +'" data-val="'+res[0].price+'">'+res[0].title+'</a>';
					}
					$("#order_address").html(str);
					that.userInfo.order_expense = res[0].price;
					that.userInfo.all_expense = res[0].price + that.userInfo.order_fee - that.userInfo.coupon_amount;
					$("#paotui_fee").text(that.userInfo.order_expense);
					$("#order_expense").text(that.userInfo.order_expense + that.userInfo.order_fee);
					$("#all_expense").text(that.userInfo.all_expense);
                }
            }
        });
		$("#order_address").on('click','.address_range',function(){
			$(this).siblings('.address_range').removeClass('active');
			$(this).addClass('active');
			that.userInfo.order_expense = parseInt($(this).attr("data-val"));
			that.userInfo.all_expense = parseInt($(this).attr("data-val")) + that.userInfo.order_fee - that.userInfo.coupon_amount;
			$("#paotui_fee").text(that.userInfo.order_expense);
			$("#order_expense").text(that.userInfo.order_expense + that.userInfo.order_fee);
			$("#all_expense").text(that.userInfo.all_expense);
		});
    },
	getUserMenuPc : function(){
		var that = this;
		var params={
            group_id : this.userInfo.group_id,
			user_lng : '',
			user_lat : '',
            user_id : 0,
			city : this.userInfo.city,
			skill_id : this.userInfo.order_type
        };
        $.post('/flow/v1_0/user/getUserMenuPc',params,function(data){
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(data.respcd==='0000'){
				if(data.data.data.length){
					that.userInfo.price = parseInt(data.data.data[0].start_price);
					that.userInfo.order_expense = that.userInfo.price;
					that.userInfo.all_expense = that.userInfo.price + that.userInfo.order_fee - that.userInfo.coupon_amount;
					$("#paotui_fee").text(that.userInfo.order_expense);
					$("#order_expense").text(that.userInfo.order_expense + that.userInfo.order_fee);
					$("#all_expense").text(that.userInfo.all_expense);
				}else{
					that.userInfo.price = 0;
				}
			}
		});
	},
	addFee : function(){
		if(verify.namber($(this))){
			loginPay.userInfo.order_fee = parseFloat($(this).val());
			loginPay.userInfo.all_expense = loginPay.userInfo.ship_expense + loginPay.userInfo.order_fee - loginPay.userInfo.coupon_amount;
			$("#order_expense").text(loginPay.userInfo.order_expense + loginPay.userInfo.order_fee);
			$("#all_expense").text(loginPay.userInfo.all_expense);
		}else if(!verify.namber($(this))&&!verify.empty($(this))){
			dialog.init("请输入正确小费");
		}
	},
	getAuxiliaryInfo : function(){
		var that = this,
		param={
            device : 'pc',
            openid : '',
        };
        $.post('/flow/v1_0/order/auxiliaryInfo', param, function(data){
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if(data.respcd === "0000"){
                that.userInfo.mobile = data.data.mobile;
                that.userInfo.user_id = data.data.user_id;
                that.userInfo.receiver_mobile = data.data.contact_mobile;
                that.userInfo.pay_channels = data.data.pay_channel;
            }   
        });
    },
	CouponList : function(){
		var params = {
			user_id : this.userInfo.user_id,
			mobile : this.userInfo.mobile,
			group_id : this.userInfo.group_id,
			city : this.userInfo.order_city,
			district : this.userInfo.ship_distance,
			stype : 1,
			category : this.userInfo.order_category,
			ship_expense : this.userInfo.order_expense + this.userInfo.order_fee
		},str='',ex_str='';
		$.ajax({
			url :'/flow/v1_0/coupon/getMyCouponList',
			data : params,
			type : 'post',
			success: function(data){
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}
				if(data.respcd === "0000"){
					for(var i=0,res=data.data.data;i<res.length;i++){
						if(res[i].flag===1){
							str += '<li class="coupon_li action" data-id="'+res[i].coupon_id+'" data-amount="'+res[i].coupon_amount+'"><img src="/static_f/imgs/img_c/coupon.png"><span><h4>'+res[i].title+'</h4><p>'+res[i].valid_windows+'</p ><p>'+res[i].type+'</p ><p>'+res[i].info+'</p ></span><span>￥'+res[i].coupon_amount+'</span></li>';
						}else if(res[i].flag===2){
							str += '<li><img src="/static_f/imgs/img_c/expired_coupon.png"><span><h4>'+res[i].title+'</h4><p>'+res[i].valid_windows+'</p ><p>'+res[i].reason+'</p ><p>'+res[i].info+'</p ></span><span>￥'+res[i].coupon_amount+'</span></li>';
						}else{
							ex_str += '<li><img src="/static_f/imgs/img_c/expired_coupon.png"><span><h4>'+res[i].title+'</h4><p>'+res[i].valid_windows+'</p ><p>'+res[i].reason+'</p ><p>'+res[i].info+'</p ></span><span>￥'+res[i].coupon_amount+'</span></li>';
						}
						
					}
					$(".coupon_ul").html(str);
					$(".coupon_exul").html(ex_str);
				}
			}
		});
	},
	payType : function(a,c){
		a.click(function(){
			a.removeClass(c);
			$(this).addClass(c);
			switch($(this).text()){
				case '微信支付' : loginPay.userInfo.pay_channel = 'wx';
				break;
				case '现金支付' : loginPay.userInfo.pay_channel = 'cash';
				break;
				case '支付宝支付' : loginPay.userInfo.pay_channel = 'alipay';
				break;
				case '钱包支付' : loginPay.userInfo.pay_channel = 'wallet';
				break;
			}
		})
	},
	pay : function(el){
		el.attr('disabled','disabled');
		el.css('background-color','#bcbcbc');
		el.text('下单中……');
		if(this.userInfo.pay_channel === 'wx'){
			this.userInfo.pay = '{"body": "快服务任务支付", "client_ip": "0.0.0.0", "currency": "cny", "amount": '+this.userInfo.all_expense+', "channel": "wx_pub_qr", "subject": "快服务任务支付"}';
		}else if(this.userInfo.pay_channel === 'alipay'){
			this.userInfo.pay = '{"body": "快服务任务支付", "client_ip": "0.0.0.0", "currency": "cny", "amount": '+this.userInfo.all_expense+', "channel": "alipay_qr", "subject": "快服务任务支付"}';
		}else{
			this.userInfo.pay = null;
		}
		$.post("/flow/v1_0/order/addErrandsOrderX",this.userInfo,function(data){
			if (typeof data === 'string') {
				data = JSON.parse(data);
			}
			if(data.respcd==="0000"){
				if (loginPay.userInfo.pay_channel === 'wx'||loginPay.userInfo.pay_channel === 'alipay'){
					qrcode.rander(data.data.charge);
				} else {
					dialog.rander();
					el.text('下单完成');
				}
			}else if(data.resperr==="获取charge对象失败"){
				dialog.init("抱歉，暂不支持微信支付");
				el.removeAttr('disabled');
				el.css('background-color','#4EB97B');
			}else if(data.respcd==="2100"){
				dialog.init("对不起，请登录");
			}else if(data.respcd==="2003"){
				dialog.init("对不起，"+data.resperr+",请联系客服");
			}else if(data.respcd==="2105"){
				dialog.init("对不起，"+data.resperr+",请重新输入");
				el.removeAttr('disabled');
				el.css('background-color','#4EB97B');
			}else{
				dialog.init(data.resperr);
				el.removeAttr('disabled');
			}
		});
	},
};
var verify = {
	//不为空验证
	empty: function(e) {
		var obj = $(e);
		if(!obj.val()) {
			return false;
		}
		return true;
	},
	//号码验证
	phone: function(e) {
		var obj = $(e),
		reg = /^\d{1}[3,4,5,7,8]\d{9}$/;
		if(!reg.test(obj.val())) {
			return false;
		}
		return true;
	},
	//数字验证
	namber: function(e){
		var obj = $(e),
		reg = /\d/;
		if(!reg.test(obj.val())) {
			return false;
		}
		return true;
	}
};
var local = {
	getLocation : function(cityName,groupId){
		var that = this;
		if(cityName&&groupId){
			that.success(cityName);
			loginPay.userInfo.group_id = groupId;
			return;
		}
		try{
			if(sessionStorage.city){
				that.success(sessionStorage.city);
				return;
			}
		}catch(e){
		}
		if (navigator.geolocation) {
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					loginPay.getCityList(r.address.city);
				}else{
					$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
						if (remote_ip_info.ret == '1') {
							loginPay.getCityList(remote_ip_info.city+"市");
						} else {
							that.error('没有找到匹配的IP地址信息！');
						}
					});
				}        
			},{enableHighAccuracy: true})
		}else{
			$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(_result) {
				if (remote_ip_info.ret == '1') {
					loginPay.getCityList(remote_ip_info.city+"市");
				} else {
					that.error('没有找到匹配的IP地址信息！');
				}
			});
		}
	},
	success : function(city){
		baseMap.moveCity(city);
		$('#location').text(city);
		try{
			sessionStorage.city = city;
			sessionStorage.group_id = loginPay.userInfo.group_id;
		}catch(e){
		}
	},
	error : function(){
	}
};
var dateTime = {
	newTime : function(ob){
		var date = new Date();
		date.setMinutes(date.getMinutes()+30);
		$(ob).val(date.getFullYear()+'-'+this.double(date.getMonth()+1)+"-"+this.double(date.getDate())+" "+this.double(date.getHours())+":"+this.double(date.getMinutes()));
		$(ob).click(function(){
			WdatePicker({
				skin : 'twoer',
				dateFmt:'yyyy-MM-dd HH:mm',
				startDate:'%y-%M-%d %H:{%m+30}',
				minDate:'%y-%M-%d %H:{%m+25}',
				maxDate:'%y-%M-{%d+2} %H:{%m+30}'
			});
		});
	},
	double : function(number){
		return number<10?"0"+number:number;
	},
}
//dialog
var dialog = (function(){
	var add = function(){
		$('body').append('<div class="dialog"><div class="dialogBg"></div><div class="dialogBody" style="'+this.marTop+'"><div id="diaTitle">'+this.title+'<span class="iconfont" id="diaClose">&#xe83f;</span></div><div id="diaText">'+this.text+'</div></div></div>').addClass('bodyFide');
		if(this.time){
			setTimeout(delet,this.time);
		}
	};
	var delet = function(){
		$(".dialog").remove();
		$('body').removeClass('bodyFide');
	};
	var main = function(){
		this.title = '';
		this.text = '';
		this.str = '';
		this.time = '';
		this.marTop = '';
		$(document).on('click',"#diaClose",delet);
	};
	main.prototype = {
		init : function(te,tit){
			this.text = te;
			this.title = tit?tit:'提示';
			this.time = 3000;
			this.marTop = 'margin-top:-0.68rem;';
			add.call(this);
		},
		rander : function(){
			this.text = '<h3><i class="iconfont">&#xe639;</i>订单提交成功</h3><p>扫码下方二维码下载APP查看订单</p><img src="/stat/images/ewn.png">';
			this.title = '提示';
			this.time = 0;
			this.marTop = 'margin-top:-1.5rem;';
			add.call(this);
		},
	};
	return new main();
})();
var qrcode = (function(){
	var state = function(){
		$(".qrcode").show();
		$('body').addClass('bodyFide');
	};
	var polling = function(){
		var that = this;
		$.ajax({
			url:'/flow/v1_0/order/getOrderPayStatus',
			data : {order_no:that.data.order_no},
			type : 'post',
			success: function(data){
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}
				if(data.respcd==="0000"&&data.data.pay_status){
					clearInterval(that.time);
					that.base = true;
					$(".qrcode").hide();
					$('body').removeClass('bodyFide');
				}
			}
		});
	};
	var qrcode = function(){
		$(function(){$('body').append('<div class="qrcode"><div class="dialogBg"></div><div class="dialogBody" style="margin-top:-1.5rem;"><div id="diaTitle">扫码支付</div><div id="diaText"><span id="qrcode"></span></div></div></div>');});
	};
	qrcode.prototype = {
		rander : function(data){
			this.data = JSON.parse(data);
			this.base = false;
			if(!this.qrcode){
				this.qrcode = new QRCode('qrcode', {
				  text: this.data.credential.wx_pub_qr?this.data.credential.wx_pub_qr:this.data.credential.alipay_qr,
				  width: 200,
				  height: 200,
				});
			}else{
				this.qrcode.clear();
				this.qrcode.makeCode('url');
			}
			state();
			this.time = setInterval(function(){polling.call(this);}.bind(this),3000);
		}
	};
	return new qrcode();
})();