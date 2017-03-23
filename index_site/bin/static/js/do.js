$(document).ready(function(){
	var city = $(document.head).find('meta[name=city]').attr('content')?$(document.head).find('meta[name=city]').attr('content'):'';
	var group_id = $(document.head).find('meta[name=group_id]').attr('content')?$(document.head).find('meta[name=group_id]').attr('content'):'';
	baseMap.base(null,$('#order_to'),$('#sure_button'),$('.closeMap'),2);
	local.getLocation(city,group_id);
	loginPay.ajax(1192);
	loginPay.active($(".btn_inline"),'active');
	$("#add_fee").on('input',loginPay.addFee);
	dateTime.newTime('#dateTime');
	loginPay.payType($(".payType li"),'active');
	$("#select_location").click(function(){
		location.href="/city.html?callback="+encodeURIComponent(location.pathname);
	});
	$("#add").click(function(){
		var namber = parseInt($("#extendTime").val());
		if(namber<9){
			$("#extendTime").val(namber+1+"小时");
		}
		if(loginPay.userInfo.price>0){
			loginPay.userInfo.order_expense = loginPay.userInfo.price*parseInt($("#extendTime").val());
			loginPay.userInfo.all_expense = loginPay.userInfo.price*parseInt($("#extendTime").val()) + loginPay.userInfo.order_fee - loginPay.userInfo.coupon_amount;
			$("#paotui_fee").text(loginPay.userInfo.order_expense);
			$("#order_expense").text(loginPay.userInfo.order_expense + loginPay.userInfo.order_fee);
			$("#all_expense").text(loginPay.userInfo.all_expense);
		}
	});
	$("#minus").click(function(){
		var namber = parseInt($("#extendTime").val());
		if(namber>1){
			$("#extendTime").val(namber-1+"小时");
		}
		if(loginPay.userInfo.price>0){
			loginPay.userInfo.order_expense = loginPay.userInfo.price*parseInt($("#extendTime").val());
			loginPay.userInfo.all_expense = loginPay.userInfo.price*parseInt($("#extendTime").val()) + loginPay.userInfo.order_fee - loginPay.userInfo.coupon_amount;
			$("#paotui_fee").text(loginPay.userInfo.order_expense);
			$("#order_expense").text(loginPay.userInfo.order_expense + loginPay.userInfo.order_fee);
			$("#all_expense").text(loginPay.userInfo.all_expense);
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
		if(!loginPay.userInfo.receiver_lat || !loginPay.userInfo.receiver_lng || !loginPay.userInfo.receiver_area){
			$("#order_to").focus();
			dialog.init("请填写代办地址");
			return false;
		}
		if(!verify.phone($("#mobile_to"))){
			$("#mobile_to").focus();
			dialog.init("请填写联系人电话");
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
		loginPay.userInfo.order_info += $("#extendTime").val();
		loginPay.userInfo.expected_time = $("#dateTime").val()+":00";
		loginPay.pay($(this));
	});
});