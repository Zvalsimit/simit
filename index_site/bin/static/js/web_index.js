$(document).ready(function() {
	var winHeight = $(window).height(),
	winWidth = $(window).width(),
	startY = 0,
	status = 0,
	oldStatus = 0,
	eventStatus = 0,
	scrollArr=[0,$(".indServiceTitle").offset().top,$(".indStrengthsTitle").offset().top];
	function touchSatrtFunc(evt) {  
		try  
		{  
			var touch = evt.touches[0]; //获取第一个触点   
			var y = Number(touch.pageY); //页面触点Y坐标
			//记录触点初始位置  
			startY = y; 
		}  
		catch (e) {  
			alert('touchSatrtFunc：' + e.message);  
		}  
	}  
	//touchmove事件，这个事件获取坐标  
	function touchMoveFunc(evt) {  
		try  
		{  
			evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等  
			var touch = evt.touches[0]; //获取第一个触点   
			var y = Number(touch.pageY); //页面触点Y坐标
			//判断滑动方向
			if (y - startY > 0&&status>0) {
				oldStatus = 0;
			}else if(y - startY < 0){
				oldStatus = 1;
			}
			
		}  
		catch (e) {  
			alert('touchMoveFunc：' + e.message);  
		}  
	}
	//touchend事件  
	function touchEndFunc(evt) {
		try {
			if(oldStatus<2){
				status = oldStatus?(status+1):(status-1);
				if(status<0){
					status = 0;
					return;
				}else if(!eventStatus&&status>2){
					status = 2;
					return;
				}else if(status>=2&&eventStatus){
					$("body").animate({scrollTop:scrollArr[1]+winHeight*(status-1)},300);
				}else{
					$("body").animate({scrollTop:scrollArr[status]},300);
				}
				oldStatus = 2;
			}
		}  
		catch (e) {  
			alert('touchEndFunc：' + e.message);  
		}  
	}  

	//绑定事件  
	function bindEvent() {
		document.addEventListener('touchstart', touchSatrtFunc, false);  
		document.addEventListener('touchmove', touchMoveFunc, false);  
		document.addEventListener('touchend', touchEndFunc, false);  
	}
	if(winWidth<750){
		try {
			document.createEvent("TouchEvent");
			bindEvent(); //绑定事件
			}
		catch (e) {  
			alert("不支持TouchEvent事件！" + e.message);  
		} 
	}
	/*function bannerAnim(arr,tar){
		//计时
		var time = 3000;
		//当前指针,二级指针
		var index = 0;
		var subIndex =0;
		var indexAnim = function(obj){
			return len = obj.length;
		};
		var subIndeAnim = function(subObj){
			var len = subObj.dec.length;
			return subTime = subObj.dec.length*time;
		};
		//初始化
		var star = function(){
			index = 0;
			subIndex =0;
			$(".bannerCon").eq(0).siblings("b").css('width','0%');
			$(".bannerCon").eq(1).siblings("b").css('width','0%');
			animet();//star animete
		}
		//二级下一个
		var naxtSub = function(){
			if(subIndex<arr[index].dec.length-1){
				subIndex++;
				$(".bannerCon").eq(1).siblings("b").css('width','0%');
				$(".bannerCon").eq(1).text(arr[index].dec[subIndex]);
				$(".bannerCon").eq(1).siblings("b").animate({'width':'100%'},time,naxtSub);
			}else{
				if(index<arr.length-1){
					index++;
					subIndex = 0;
					$(".bannerCon").eq(0).siblings("b").css('width','0%');
					$(".bannerCon").eq(1).siblings("b").css('width','0%');
					animet();
				}else{
					star();
				}
			}
		}
		//开始切换
		var animet = function(){
			$(".bannerCon").eq(0).text(arr[index].title);
			$(".bannerCon").eq(1).text(arr[index].dec[subIndex]);
			$(".bannerCon").eq(0).siblings("b").animate({'width':'100%'},subIndeAnim(arr[index]));
			$(".bannerCon").eq(1).siblings("b").animate({'width':'100%'},time,naxtSub);
		}
		star();
	}
	bannerAnim([
		{title:"跑腿小哥",dec:["买早餐","买夜宵","买咖啡","买水果"]},
		{title:"维修师傅",dec:["修电灯","修插座","修马桶"]},
		{title:"家政阿姨",dec:["打扫卫生","做饭"]},
		{title:"宠物师",dec:["遛狗","小狗美容","看小狗"]}
	],$(".bannerCon"));*/
	function animete(){
		if($('.conBanner').hasClass("action")){
			$('.conBanner').removeClass("action");
			setTimeout(animete,8000)
		}else{
			$('.conBanner').addClass("action");
			setTimeout(animete,1000)
		}
	}animete()
	$(".serviceBtn").click(function(){
		if(!$("#indService").hasClass('action')){
			eventStatus = 1;
			$("#indService").addClass("action");
			$('.serviceBtn').text('收起');
		}else{
			eventStatus = 0;
			$("#indService").removeClass("action");
			$('.serviceBtn').text('查看更多');
		}
	});
	
	$(".downLoad").click(function(){
		zhuge.track(urlSearch+"下载app");
	})
});