(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Service (hyperlinkSvc) -----# //
	app.factory('hyperlinkSvc', function ($q,  permissionSvc, userSvc) {

		var _defer = $q.defer();

		$q.all([permissionSvc.ready, userSvc.ready]).then(function () {
			_defer.resolve();
		});

		function canLinkToEmp() { return (userSvc.isOrgUser() && permissionSvc.iHave('EMP.EMPVIEWGENERAL')) }
		function canLinkToSub() { return (userSvc.isOrgUser() && permissionSvc.iHave('SUB.SUBVIEWGENERAL')) }
		function canLinkToInst() { return (userSvc.isOrgUser() && permissionSvc.iHave('INST.INSTVIEWGENERAL')) }
		function canLinkToVacProf() { return (userSvc.isOrgUser() && permissionSvc.iHave('VACPROF.VACVIEWGENERAL')) }
		function canLinkToOrgUser() { return (userSvc.isOrgUser() && permissionSvc.iHave('SECURITY.SECORGUSERVIEW')) }
		function canLinkToCampusUser() { return (userSvc.isOrgUser() && permissionSvc.iHave('SECURITY.SECCAMPUSUSERVIEW')) }
		function canLinkToSubForCampusUser() { return (userSvc.isCampusUser() && permissionSvc.iHave('SUB.SUBVIEWGENERAL')) }
		
		function empLink(work_id) { return (canLinkToEmp() ? "/navigator/te_general.asp?x=x&TB2=TAB1&TB1=TAB1&work_id=" + work_id : "");}
		function subLink(sub_id) { return (canLinkToSub() ?  "/navigator/sub_general.asp?x=x&TB2=TAB1&TB1=TAB1&sub_id=" +  sub_id : "");}
		function instLink(inst_id) { return (canLinkToInst() ? "/navigator/s_general.asp?TB2=TAB1&TB1=TAB1&inst_id=" + inst_id : "");}
		function vacProfLink(vacProf_id) { return (canLinkToVacProf() ? "/navigator/vp_general.asp?x=x&TB1=TAB1&TB2=&work_id=" + vacProf_id : "");}
		function orgUserLink(ou_id) { return (canLinkToOrgUser() ? "/navigator/ou_general.asp?x=x&ou_type=4&ou_id=" + ou_id : "");}
		function campusUserLink(ou_id) { return (canLinkToCampusUser() ? "/navigator/ou_general.asp?x=x&ou_type=5&ou_id=" + ou_id : "");}
        function subLinkForCampusUser(sub_id) { return (canLinkToSubForCampusUser() ? "/substitute/" + sub_id  : "");}

		return {
			ready: _defer.promise,

			empLink: empLink,
			subLink: subLink,
			instLink: instLink,
			vacProfLink: vacProfLink,
			orgUserLink: orgUserLink,
			campusUserLink: campusUserLink,
			subLinkForCampusUser: subLinkForCampusUser

		};
	});
	// #--- END Service (hyperlinkSvc) ---# //
	// #-----------------------------# //

}());
