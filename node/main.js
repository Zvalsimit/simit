var fs = require("fs");
var data = fs.readFile("index.text",function(err,data){
	if(err) return console.log(err);
	console.log(data.toString());
});
console.log("结束");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var listener1 = function (){
	console.log("监听器listener1 执行");
}
var listener2 = function(){
	console.log("监听器listener2 执行");
}
eventEmitter.addListener('connection',listener1);
eventEmitter.on('connection',listener2);
var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners);
