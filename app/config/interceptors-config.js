(function () {'use strict'; var app = angular.module('aesop');

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
		$httpProvider.interceptors.push('idmAuthInterceptor');
		//DE12637 WRONG DATA ISSUE
		$httpProvider.interceptors.push('orgIdInterceptor');
		$httpProvider.interceptors.push('resourceRequestInterceptor');
		$httpProvider.interceptors.push('403Interceptor');
		$httpProvider.interceptors.push('404Interceptor');
		//Needed to support setting cookies on cross domain requests (https://gist.github.com/mlynch/be92735ce4c547bd45f6)
        //API needs to have CorsPolicy.SupportsCredentials set to true for this to work
		$httpProvider.defaults.withCredentials = true;
	});

}());
