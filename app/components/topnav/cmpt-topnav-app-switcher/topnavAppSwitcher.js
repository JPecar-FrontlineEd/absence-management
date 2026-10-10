(function() {'use strict';angular.module('aesop')
.directive('cmptTopnavAppSwitcher', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/topnav/cmpt-topnav-app-switcher/topnavAppSwitcher.html',

// #----------------------------------------------# //
// #---- Component (cmpt-topnav-app-switcher) ----# //
controller: function ($q,$scope, stringSvc, productSvc,config,systemApi,tokenSvc, permissionSvc) {

	var notPurchasedMnumonic = 'AdminWeb.AppSwitcher.NotAvailable';

	// View Model properties
	var vm = $scope.vm = {
		products: [],
		aesopObj: null
	};

	stringSvc.ready.then(function () {
		$scope.strings = stringSvc.getStrings([
			notPurchasedMnumonic
		]);
	});

	$q.all([permissionSvc.ready, productSvc.ready]).then(function (dtl){
		let isVeritimeOnly = permissionSvc.iHave('PSEUDO.IsVeritimeOnly');
		var products = dtl[1];

		var aesop = products.filter(x => x.name === 'Aesop')[0];
		vm.aesopObj = angular.copy(aesop);
		vm.aesopObj.hideRealName = (isVeritimeOnly);
		vm.aesopObj.displayName = (vm.aesopObj.hideRealName) ? 'Absence Data' : vm.aesopObj.displayName;

		vm.products = angular.copy(products).map(function (v, i, a) {
			let isAesop = (v.name === 'Aesop');
			v.hideRealName = (isVeritimeOnly && isAesop);
			v.displayName = v.hideRealName ? 'Absence Data' : v.displayName;

			v.mode = v.mode.toLowerCase();
			v.purchased = v.mode === 'purchased';
			v.active = isAesop;
			v.lCaseName = v.name.toLowerCase();
			v.marketingUrl = (v.purchased) ? '' : v.marketingUrl;
			v.loadUrl =  (v.purchased) ? config.apiEndpoint + '/v1.0/'+v.url+'?token=' + tokenSvc.get() : '';
			if (v.active) { v.loadUrl = '/'; }
			v.titleTextMnumonic = (v.purchased) ? '' : notPurchasedMnumonic;
			return v;
		});
	});



	$scope.go =  {
		GotoProduct: function (prod) {
			if(prod.marketingUrl !== ''){
				window.location = prod.marketingUrl;
			}else if(prod.loadUrl !== ''){
				console.log('going to url');
				systemApi.GotoVeritime({token:tokenSvc.get()});
			}
		}
	};
}

// #-- END Component (cmpt-topnav-app-switcher) --# //
// #----------------------------------------------# //
};});}());
