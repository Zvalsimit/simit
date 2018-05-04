var base = (function(){
    var comArr = [];
    var validate = {
        // 为空
        isNotEmpty: function(value,errorMsg) {
            if(value == '') {
                comArr["d"].call(base,errorMsg)
                return false;
            }else{
                return true;
            }
        },
        // 最小长度
        minLength: function(value,errorMsg,length) {
            if(value.length < length) {
                comArr["d"].call(base,errorMsg)
                return false;
            }else{
                return true;
            }
        },
        // 数字
        number: function(value,errorMsg) {
            if(!/^\d*$/.test(value)) {
                comArr["d"].call(base,errorMsg);
                return false;
            }else{
                return true;
            }
        },
        // 号码格式
        mobile: function(value,errorMsg) {
            if(!/^1\d{10}$|^(0\d{2,3})?\d{7,8}$/.test(value)) {
                comArr["d"].call(base,errorMsg);
                return false;
            }else{
                return true;
            }
        } 
    };
    var focus_fn = function(){
        $(this).parents(".dialog").css({"top":$(document).scrollTop()+"px","position":"absolute"});
    };
    var blur_fn = function(){
        $(this).parents(".dialog").css({"top":"0px","position":"fixed"});
    }
    comArr["v"] = function(){
        var argArr = Array.prototype.slice.call(arguments);
        return argArr.every(function(e){
            return e.v.every(function(el,index){
                return validate[el.split(":")[0]](e.ob,e.errorMsg[index],el.split(":")[1])
            })
        })
    };
    comArr["d"] = function(msg,tit,fn,t,top){
        if(!this.dialog_body){
            this.dialog();
        }
        if(typeof msg === 'string'){
            this.dialog_body.html(msg);
        }else if(typeof msg !== 'boolean'){
            return;
        }
        if(typeof tit === 'string'){
            this.dialog_title.text(tit);
        }
        if(typeof fn === 'function'&&typeof t === 'boolean'&&t){
            //按键绑定事件
            this.dialog_foot.show();
            this.dialog_body.removeClass(this.class);
            this.dialog_sure.on("click",fn);
        }else if(typeof fn === 'function'&&typeof t === 'number'&&t){
            //定时时间
            this.dialog_body.addClass(this.class);
            this.dialog_foot.hide();
            this.time = setInterval(fn,t);
        }else if(typeof fn === 'boolean'&&fn){
            //按键
            this.dialog_foot.show();
            this.dialog_body.removeClass(this.class);
            bind_(this.dialog_sure,'click',this.init.bind(this));
        }else{
            this.dialog_body.addClass(this.class);
            this.dialog_foot.hide();
        }
        if(typeof top === 'number'){
            this.top = top;
            this.dialog.on("focus","input",focus_fn);
            this.dialog.on("blur","input",blur_fn);
        }
        this.dialog.show();
    };
    comArr["s"] = function(){
        var search = decodeURI(document.location.search);
        return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
            values = item.split('=');
            result[values[0]] = values[1];
            return result;
        }, {});
    };
    comArr["a"] = function(u,t,d,fn){
        $.ajax({
            url : u,
            type : t,
            data : d,
            success: function(res){
                if (typeof res === 'string'){
                    res = JSON.parse(res);
                }
                if (res.respcd === '0000'){
                    fn.call(null,res)
                }else{
                    alert(res.resperr)
                    //comArr["d"].call(base,res.resperr)
                }
            },
            error: function(){
                alert("网络错误")
                //comArr["d"].call(base,"网络错误");
            }
        })
    };
    var bind_ = function(a,e,fn){
        $(a).on(e,fn);
    };
    function common(){
        this.time = null;
        this.result = null;
    };
    common.prototype = {
        assign : function(){
            var argsArr = Array.prototype.slice.call(arguments),that=this;
            argsArr.every(function(e){
                return that.result = comArr[e.a].apply(that,e.data);
            })
            return this.result;
        },
        dialog : function(){
            var that = this;
            this.dialog = $(".dialog");
            this.dialog_body = $(".dialog_body");
            this.dialog_title = $(".dialog_title");
            this.dialog_close = $(".dialog_close");
            this.dialog_foot = $(".dialog_foot");
            this.dialog_cancel = $(".dialog_cancel");
            this.dialog_sure = $(".dialog_sure");
            this.class = "heigher";
            this.top = '';
            bind_(this.dialog_close,'click',this.init.bind(this));
            bind_(this.dialog_cancel,'click',this.init.bind(this));
        },
        init : function(){
            clearInterval(this.time);
            this.dialog_sure.unbind();
            this.dialog.hide();
            if(typeof top === 'number'){
                this.top = '';
                this.dialog.off("focus","input",focus_fn);
                this.dialog.off("blur","input",blur_fn);
            }
        },
        search : function(city,addr,fn){
            var local = new BMap.LocalSearch(city,{
                onSearchComplete: function(){
                    var arr = [];
                    if (local.getStatus() == BMAP_STATUS_SUCCESS){
                        for(var i = 0;i < local.getResults().getCurrentNumPois();i++){
                            arr.push(local.getResults().getPoi(i));
                        }
                        fn(arr);
                    }else{
                        fn();
                    }
                }
            });
            local.search(addr);
        },
        location : function(fn){
            var convertor = new BMap.Convertor();
            wx.ready(function (){
                //获取用户位置
                wx.getLocation({
                    type: 'wgs84', 
                    success: function (res) {
                        var pointArr = [];
                        pointArr.push(new BMap.Point(res.longitude,res.latitude));
                        convertor.translate(pointArr, 1, 5, function(data){
                            if(data.status === 0) {
                                fn(data.points[0].lng,data.points[0].lat);
                            }
                        })
                    }
                });
            });
            wx.error(function (res) {
                return false;//alert(res.errMsg);
            });
            if (navigator.userAgent.toLowerCase().match(/MicroMessenger/gi) != "micromessenger"&&navigator.geolocation) {
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        fn(r.longitude,r.latitude);
                    }
                },{enableHighAccuracy: true})
            }else{
                
            }
        },
        router : function(rout){
            location.href = "#";
            window.onhashchange = function(){
                var obj = $("#"+location.hash.substr(1))[0]?$("#"+location.hash.substr(1)):$("#allmap");
                obj.show().siblings().hide();
            };
        },
        parse : function(arr){
            return arr.map(function(e,i){
                return typeof e === "string"?JSON.parse(e):JSON.stringify(e);
            })
        }
    };
    return new common();
})();
var setTime = function(ob,s,fn){
    var time = s?s:900;
    var replace = function(t){
        return Math.floor(t/60).toString()+":"+((t%60)>9?(t%60).toString():"0"+(t%60).toString());
    };
    return{
        init : function(){
            ob.text(replace(time));
            time --;
            if(time>0){
                setTimeout(arguments.callee,1000)
            }else{
                fn();
            }
        }
    }
}