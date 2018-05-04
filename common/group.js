//分站搜索
var addSearch = (function(){
	var _bind = function(that){
		$("body").on("click","#group_id",function(){
			$(".city_select").toggle();
		});
		that.input.on("input",function(){
			that.render();
		});
	};
	var getlen = function(that){
		return that.input.val().length;
	};
	var subAdd = function(that,index){
		return that.addArr[index].group_name.substring(0,getlen(that));
	}
	var TextCountFun = function(config){
		this.addcon = function(i){
			return '<li onclick="changeGroup(this);"><p data-group-id="'+this.addArr[i].group_id+'">'+this.addArr[i].group_name+'</p></li>';
		}
	};
	TextCountFun.prototype = {
		init   : function(config,addArr){
			this.input = $(config);
			this.addArr = addArr;
			this.input.after('<ul class="extended notification" style="position:fixed;top:40px;left:290px;max-height:95%;overflow-y:auto;z-index: 1000;display: none;box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);font-size: 14px;border: 1px solid #DDD;background: #fff;margin-left: 0;width: 150px;"></ul>');
			_bind(this);
		},
		render : function(){
			this.str = '';
			for(var i=0;i<this.addArr.length;i++){
				this.str += (this.input.val()===subAdd(this,i)?this.addcon(i):'');
			}
			this.input.siblings('ul').html(this.str);
			this.input.siblings('ul').show();
			this.input.siblings('ul').on("click","p",function(){
				$(this).parent().parent().hide();
			});
		}
	};
	return TextCountFun;
})();
//history
var historyBody = (function(){
    var _bind = function(){
        var that = this;
        this.obj.on("click",'li',function(){
		if(that.index != $(this).index()){
			that.index = sessionStorage.index = $(this).index();
		}
		addHistory.call(that,true);
        });
        this.obj.on("click",'li b',function(){
            if(that.historyArr.length>1&&that.index>$(this).parent().index()){
                that.index--;
            }else if(that.historyArr.length>1&&that.index===$(this).parent().index()===0){
                that.index++;
            }else if(that.historyArr.length>1&&that.index>0&&that.index===$(this).parent().index()){
                that.index--;
            }else if(that.historyArr.length ===1 ){
                return false;
            }
            that.newUrl = '';
            that.historyArr.splice($(this).parent().index(),1);
            addHistory.call(that);
            return false;
        });
        this.menu.on("click","li a",function(){
		that.addHistory($(this).attr("data-href"),$(this).text());
        });
        $("#groups,.data_href").on("click",function(){
		that.addHistory($(this).attr("data-href"),$(this).children(".title").text());
        });
    };
    var proof = function(text){
        var that = this;
        return this.historyArr.some(function(e,i){
            if(text===e.text){
                that.index = i;
                return true;
            }
        });
    };
    var addHistory = function(arg){
	var that = this;
        this.str = '';
        this.historyArr.forEach(function(i,ind){
		that.str += "<li data-href='"+i.href+"'>"+i.text+"<b>x</b></li>";
		if(!arg&&$(that.contain[ind]).find("iframe").attr("src")!==i.href){
			$(that.contain[ind]).find("iframe").attr("src",i.href);
		}else if(arg&&($(that.contain[ind]).find("iframe").attr("src")!==i.href)&&(ind==that.index)){
			$(that.contain[ind]).find("iframe").attr("src",i.href);
		}else if(!arg&&that.newUrl&&(that.newUrl!==i.href)&&(ind==that.index)){
                        i.href = that.newUrl;
                        $(that.contain[ind]).find("iframe").attr("src",i.href);
                }
        });
        this.obj.html(this.str);
        sessionStorage.index = this.index;
	$(this.contain[this.index]).addClass(that.class).siblings(".iframe-box").removeClass(that.class);
        this.obj.find("li").eq(this.index).addClass("active");
        sessionStorage.historyArr = JSON.stringify(this.historyArr);
    };
    var historyBody = function(){
        this.str = '';
        this.box = null;
        this.url = '/bmis/view/information';
        this.title = "必读信息";
	    this.newUrl = '';
        this.historyArr = sessionStorage.historyArr?JSON.parse(sessionStorage.historyArr):[{href:this.url,text:this.title}];
        this.index = sessionStorage.index?parseInt(sessionStorage.index):0;//指针
    	this.contain = Array.prototype.slice.call($(".iframe-box"));
    	this.class = "iframe_active";
        };
        historyBody.prototype={
        rander : function(ob,menu,ele,cal){
            this.obj = $(ob);
            this.menu = $(menu);
            addHistory.call(this,true);
            _bind.call(this);
        },
        addHistory : function(href,text){
            this.newUrl = href;
            if(href&&!proof.call(this,text)&&this.historyArr.length<5){
                this.historyArr.push({href:href,text:text});
                this.index = this.historyArr.length-1;
                addHistory.call(this);
            }else if(href&&!proof.call(this,text)&&this.historyArr.length>=5){
                this.historyArr.shift();
                this.historyArr.push({href:href,text:text});
                this.box = this.contain.shift();
                this.contain.push(this.box);
                this.index = this.historyArr.length-1;
                addHistory.call(this);
            }else if(href){
                addHistory.call(this);
            }
	}
    };
    return new historyBody();
})();
$(function() {
	new addSearch().init("#search",[1,2]);
	historyBody.rander("#history",".sub-menu");
});
