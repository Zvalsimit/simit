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
			that.index = sessionStorage.index = $(this).index();
			if(location.pathname!==that.historyArr[that.index].href){
				location.href = $(this).attr("data-href");
			}
			$(this).addClass("active").siblings().removeClass("active");
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
			that.historyArr.splice($(this).parent().index(),1);
			addHistory.call(that);
			return false;
		});
		this.menu.on("click","li a",function(){
			if($(this).attr("data-href")&&!proof.call(that,$(this).text())&&that.historyArr.length<5){
				that.historyArr.push({href:$(this).attr("data-href"),text:$(this).text()});
				that.index = that.historyArr.length-1;
				addHistory.call(that);
			}else if($(this).attr("data-href")&&!proof.call(that,$(this).text())&&that.historyArr.length>=5){
				that.historyArr.shift();
				that.historyArr.push({href:$(this).attr("data-href"),text:$(this).text()});
				that.index = that.historyArr.length-1;
				addHistory.call(that);
			}else if($(this).attr("data-href")){
				addHistory.call(that);
			}
		});
		$("#groups,#group_site").on("click",function(){
			if($(this).attr("data-href")&&!proof.call(that,$(this).children(".title").text())&&that.historyArr.length<5){
				that.historyArr.push({href:$(this).attr("data-href"),text:$(this).children(".title").text()});
				that.index = that.historyArr.length-1;
				addHistory.call(that);
			}else if($(this).attr("data-href")&&!proof.call(that,$(this).children(".title").text())&&that.historyArr.length>=5){
				that.historyArr.shift();
				that.historyArr.push({href:$(this).attr("data-href"),text:$(this).children(".title").text()});
				that.index = that.historyArr.length-1;
				addHistory.call(that);
			}else if($(this).attr("data-href")){
				addHistory.call(that);
			}
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
	var addHistory = function(){
		var that = this;
		this.str = '';
		this.historyArr.forEach(function(i){
			that.str += "<li data-href='"+i.href+"'>"+i.text+"<b>x</b></li>";
		});
		this.obj.html(this.str);
		sessionStorage.index = this.index;
		this.obj.find("li").eq(this.index).addClass("active");
		sessionStorage.historyArr = JSON.stringify(this.historyArr);
		if(this.url!==this.historyArr[this.index].href){
			location.href = this.historyArr[this.index].href;
		}
	};
	var historyBody = function(){
		this.str = '';
		this.url = location.search?location.pathname+location.search:location.pathname;
		this.historyArr = sessionStorage.historyArr?JSON.parse(sessionStorage.historyArr):[{href:this.url,text:document.title.split("|")[1]?document.title.split("|")[1]:document.title}];
		this.index = sessionStorage.index?parseInt(sessionStorage.index):0;//指针
	};
	historyBody.prototype={
		rander : function(ob,menu){
			this.obj = $(ob);
			this.menu = $(menu);
			addHistory.call(this);
			_bind.call(this);
		}
	};
	return new historyBody();
})();
$(function() {
	new addSearch().init("#search",[1,2]);
	historyBody.rander("#history",".sub-menu");
});
