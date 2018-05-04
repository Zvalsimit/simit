var addSearch = (function(){
	var _bind = function(that){
		that.input.on("input",function(){
			that.render();
		});
	};
	var getlen = function(that){
		return that.input.val().length;
	};
	var subAdd = function(that,index){
		return that.addArr[index].group_name.substring(0,getlen(that));
	};
	var TextCountFun = function(config){
		this.addcon = function(i){
			return '<li onclick="changeGroup(this);"><p data-group-id="'+this.addArr[i].group_id+'">'+this.addArr[i].group_name+'</p></li>';
		};
	};
	TextCountFun.prototype = {
		init   : function(config,addArr){
			this.input = $(config);
			this.addArr = addArr;
			this.input.after('<ul class="extended notification" style="position:fixed;top:40px;right:200px;max-height:95%;overflow-y:auto;z-index: 1000;display: none;box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);font-size: 14px;border: 1px solid #DDD;"></ul>');
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
				$(this).parents("ul").hide();
			});
		}
	};
	return TextCountFun;
})();
$(function(){
	arr = [{group_id:100007,group_name:'111北京快服务'},{group_id:100007,group_name:'123石家庄快服务'},{group_id:100007,group_name:'112北门快服务'}];
	new addSearch().init("#search",arr);
});