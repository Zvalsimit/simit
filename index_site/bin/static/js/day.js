$(document).ready(function(){
	var city = $(document.head).find('meta[name=city]').attr('content')?$(document.head).find('meta[name=city]').attr('content'):'';
	var group_id = $(document.head).find('meta[name=group_id]').attr('content')?$(document.head).find('meta[name=group_id]').attr('content'):'';
	baseMap.base($("#order_from"),$('#order_to'),$('#sure_button'),$('.closeMap'),2);
	local.getLocation(city,group_id);
	loginPay.ajax(1223);
	loginPay.active($(".btn_inline"),'active');
	$("#add_fee").on('input',loginPay.addFee);
	loginPay.payType($(".payType li"),'active');
	$("#select_location").click(function(){
		location.href="/city.html?callback="+encodeURIComponent(location.pathname);
	});
	$(".date_time").click(function(){
		$(".date_time").removeClass('active');
		$(this).addClass('active');
		loginPay.userInfo.order_extend_info = $(this).text();
	})
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
			dialog.init("请填写取货地址");
			return false;
		}
		if(!verify.phone($("#mobile_from"))){
			$("#mobile_from").focus();
			dialog.init("请填取货电话");
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