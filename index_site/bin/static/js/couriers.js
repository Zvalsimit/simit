$(function(){
    var $tabConList = $('.con_wrap>.select_list')
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var isWeixin = u.indexOf('MicroMessenger') > -1;
    $('.tab_wrap').on('click', '.tab_item', function(event) {
        var index = $(this).index()
        var $ul = $tabConList.eq(index).addClass('act').siblings('.select_list').removeClass('act')
        $('.tab_mask').show()
		$(".nav_tab_show").addClass("active")
    });
    $('.con_wrap').on('click', 'li', function(event) {
        var $list = $(this).parents('.select_list')
        if($(this).find('.child_list_wrap').length){
            $(this).addClass('show_child_list').siblings('.show_child_list').removeClass('show_child_list')
        }
    });
    $('.tab_mask').on('click', function(event) {
        $(this).hide()
        $tabConList.removeClass('act')
		$(".nav_tab_show").removeClass("active")
    });
	$(document).ready(function(){
		$("#menuBtn").onclick(function(e){
			$("#menuWeb").css('left',0);
			$(this).css('display','none');
			return false;
		});
		$("#menuWeb").onclick(function(){
			$(this).css('left','100%');
			$("#menuBtn").css('display','block');
		});
    });
})
