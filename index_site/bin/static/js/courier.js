var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var isWeixin = u.indexOf('MicroMessenger') > -1;
(function(){ 
    var page=2;
    var comments_html="";
    var get_comment_url; 
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(window).height();
        var innerHeight = window.innerHeight;
        var courier_id= $("meta[name=courier_id]").attr("content");
        if (scrollTop >= scrollHeight-windowHeight) {
            comments_html=""
            get_comment_url ='/courier/comment?c='+courier_id+'&p='+page;
            $.get(get_comment_url,function(data){
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
                if(data.respcd=='0000'){
                    if(data.data.data.length!=0){
                        for(var i=0;i<data.data.data.length;i++){
                            comments_html='<section class="box_2"><div class="personal-comment"><div class="box_li" style="line-height: 20px; overflow: hidden;"><div class="comment-title"><label>'+data.data.data[i].time+'</label> <div class="comment-score">';
                            for(var j=0; j<data.data.data[i].score;j++){
                                comments_html += '<i class="iconfont star" style="color:#edb10f;font-size:10px;">&#xe630;</i>';
                            }
                            for(var l=0; l<(5-data.data.data[i].score);l++){
                                comments_html += '<i class="iconfont star" style="color:#bcbcbc;font-size:10px;">&#xe630;</i>';
                            }
                            comments_html +='</div></div><div class="order-info"><p>'+data.data.data[i].order_info+'</p></div></div>';
                            if(data.data.data[i].comment.content){
                                comments_html += '<div clsass="box_li" style="line-height: 20px; border:none;"><div class="user-photo">';
                                if(data.data.data[i].comment.head_portrait_url!=''){
                                    comments_html += '<img src="'+data.data.data[i].comment.head_portrait_url+'></div>';
                                }else{
                                    if(data.data.data[i].comment.gender == 2){
                                        comments_html += '<img src="/static/images/head_women@2x.png"></div>'; 
                                    }else{
                                        comments_html += '<img src="/static/images/head_men@2x.png"></div>'; 
                                    }
                                }
                                comments_html += '<div class="user-comments"><p>'+data.data.data[i].comment.name;
                                if (data.data.data[i].comment.gender== 2){
                                    comments_html +='<img src="/static/images/women@2x.png">';
                                }
                                else{
                                    comments_html +='<img src="/static/images/men@2x.png">';
                                }
                                comments_html += '</p><p>'+data.data.data[i].comment.content+'</p></div></div></div></section></section>';
                                
                            }
                            $("#comments").append(comments_html);
                        }
                        page++;
                    }
                }
            });
        }
    });
    $(document).ready(function(){
        // var $iframe = $('<iframe style="display:none" src="/static_f/imgs/img_c/bg.png"></iframe>');
        // $iframe.on('load',function() {
        //     setTimeout(function() {
        //         $iframe.off('load').remove();
        //     }, 0);
        // }).appendTo($('body'));
        if($('.banner').attr('data-url')!=''){
            var bg_img  = new Image();
            bg_img.src = $('.banner').attr('data-url');
            //需图片加载完再执行，否则无法获得其高度
            bg_img.onload=function(){
                var height = bg_img.height;
                var w_width = $(window).width();
                var width = bg_img.width;
                var w_size = w_width/250;
                var size = width/height;
                if(w_size>=size){
                    $('.banner').css('background-size','100% auto');
                }else{
                    $('.banner').css('background-size','auto 100%');
                }
            }
        }
        $('.picCont').fancybox({
            type : 'image'
        });
		$("#menuBtn").onclick(function(e){
			$("#menuWeb").css('left',0);
			$(this).css('display','none');
			return false;
		});
		$("#menuWeb").onclick(function(){
			$(this).css('left','100%');
			$("#menuBtn").css('display','block');
		});
        var browser = {
            versions: function () {
                var u = navigator.userAgent,app = navigator.appVersion;
                return {         //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if(browser.versions.mobile){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger"||ua.match(/QQ/i) == "qq") {
                    //在微信 新浪微博客户端 QQ 打开
                    $(".footer").css('display','block')
                    $("#footerbg").css('display','block')
            }
        }
    });

})()

function serviceAp(th){
    var $this = $(th);
    var user_id = $this.attr("cid");
    var nick_name = $this.attr("nname");
    var service_id = $this.attr("sid");
    try{
        if(isAndroid && androidWebApi && !isWeixin){
            androidWebApi.startServiceDetail(user_id,nick_name,service_id);
        }else if(isiOS && !isWeixin){
            service_detail(user_id,nick_name,service_id);
        }
    }catch(e){
            //alert("请在快服务中打开");
    }
}



