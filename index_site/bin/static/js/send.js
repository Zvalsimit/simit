$(document).ready(function(){
	var city = $(document.head).find('meta[name=city]').attr('content')?$(document.head).find('meta[name=city]').attr('content'):'';
	var group_id = $(document.head).find('meta[name=group_id]').attr('content')?$(document.head).find('meta[name=group_id]').attr('content'):'';
	baseMap.base($("#order_from"),$('#order_to'),$('#sure_button'),$('.closeMap'),0);
	local.getLocation(city,group_id);
	loginPay.ajax(1011);
	loginPay.active($(".btn_inline"),'active');
	$("#add_fee").on('input',loginPay.addFee);
	loginPay.payType($(".payType li"),'active');
	$("#select_location").click(function(){
		location.href="/city.html?callback="+encodeURIComponent(location.pathname);
	});
	$("#heat_box a").click(function(){
		$("#heat_box a").removeClass('active');
		$(this).addClass('active');
		if($(this).attr('data-val')==="1"){
			loginPay.userInfo.order_extend_info += '保温箱 ';
		}else{
			loginPay.userInfo.order_extend_info = loginPay.userInfo.order_extend_info.split('保温箱 ').join("");
		}
	});
	$("#car_distribution a").click(function(){
		$("#car_distribution a").removeClass('active');
		$(this).addClass('active');
		if($(this).attr('data-val')==="1"){
			loginPay.userInfo.order_extend_info += '汽车配送 ';
			loginPay.userInfo.car_flag = 1;
		}else{
			loginPay.userInfo.order_extend_info = loginPay.userInfo.order_extend_info.split('汽车配送 ').join("");
			loginPay.userInfo.car_flag = 0;
		}
		baseMap.sureMap();
	});
	$("#order_price a").click(function(){
		$("#order_price a").removeClass('active');
		$(this).addClass('active');
		if($(this).attr('data-val')==="1"){
			loginPay.userInfo.order_extend_info += '代收货款 ';
		}else{
			loginPay.userInfo.order_extend_info = loginPay.userInfo.order_extend_info.split('代收货款 ').join("");
		}
	});
	$("#login_btn").click(function(){
		if(!verify.phone($("#acode_mobile"))){
			$("#acode_mobile").focus();
			dialog.init("请填写手机号");
			return false;
		}
		if(!$("#acode").val()){
			$("#acode").focus();
			dialog.init("请填写验证码");
			return false;
		}
		loginPay.login();
	});
	$("#pay_btn").click(function(){
		if(!loginPay.userInfo.supplier_lat || !loginPay.userInfo.supplier_lng || !loginPay.userInfo.supplier_area){
			$("#order_from").focus();
			dialog.init("请填写发货地址");
			return false;
		}
		if(!verify.phone($("#mobile_from"))){
			$("#mobile_from").focus();
			dialog.init("请填发货人电话");
			return false;
		}else{
			loginPay.userInfo.supplier_phone = $("#mobile_from").val();
		}
		if(!loginPay.userInfo.receiver_lat || !loginPay.userInfo.receiver_lng || !loginPay.userInfo.receiver_area){
			$("#order_to").focus();
			dialog.init("请填写收货地址");
			return false;
		}
		if(!verify.phone($("#mobile_to"))){
			$("#mobile_to").focus();
			dialog.init("请填写收货人电话");
			return false;
		}else{
			loginPay.userInfo.receiver_phone = $("#mobile_to").val();
		}
		if($("#order_extend_info").val()){
			loginPay.userInfo.order_extend_info += $("#order_extend_info").val();
		}
		if(!loginPay.userInfo.base){
			dialog.init("请登录后完成订单");
			return false;
		}
		loginPay.userInfo.supplier_address = $("#order_from_detail").val()?$("#order_from_detail").val():'';
		loginPay.userInfo.receiver_address = $("#order_to_detail").val()?$("#order_to_detail").val():'';
		loginPay.pay($(this));
	});
});