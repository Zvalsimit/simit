$(document).ready(function() {
	function bannerAnim(arr,tar){
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
	$(".serviceBtn").click(function(){
		if(!$("#service").hasClass('action')){
			$("#service").addClass("action");
			$('.serviceBtn').text('收起');
		}else{
			$("#service").removeClass("action");
			$('.serviceBtn').text('查看更多');
		}
	});
	bannerAnim([
		{title:"跑腿小哥",dec:["买早餐","买夜宵","买咖啡","买水果"]},
		{title:"维修师傅",dec:["修电灯","修插座","修马桶"]},
		{title:"家政阿姨",dec:["打扫卫生","做饭"]},
		{title:"宠物师",dec:["遛狗","小狗美容","看小狗"]}
	],$(".bannerCon"));
	$(".downLoad").click(function(){
		zhuge.track("官网下载app"+urlSearch);
	})
	/*var swiper = new Swiper('.swiper-container', {
		autoplay: 5000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
    });*/
});