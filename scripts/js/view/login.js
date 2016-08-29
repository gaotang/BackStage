require(['angular','bootStrap','controllers/login/loginCtrl'],function(angular){
	angular.element(document).ready(function(){
		angular.bootstrap(document,["loginApp"]);		
	})
});