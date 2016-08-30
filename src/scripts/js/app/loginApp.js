define(['angular','app/injector'],function(angular,injector){
	var app=angular.module('loginApp',[]);
	injector.AuthHandler(app);//header验证
	injector.HttpFilterHandler(app);//http拦截	
	return app;
}) 