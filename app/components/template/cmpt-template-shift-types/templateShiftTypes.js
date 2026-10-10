(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateShiftTypes', function () {return {

// directive options
restrict: 'E',
scope: {
	absences:'=',
	useAbsenceSubShiftType: '=?',
	wrapTextInLine:'=?'
},
replace: true,
templateUrl: '/components/template/cmpt-template-shift-types/templateShiftTypes.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-template-shift-types) ----# //
controller: function ($scope, stringSvc, shiftTypesSvc, institutionSvc) {

	var propShiftType = '';
	if ($scope.useAbsenceSubShiftType !== null && $scope.useAbsenceSubShiftType != true) {
		propShiftType='shiftType';
	} else {
		propShiftType='substituteShiftType';
	}

	// View Model properties
	var vm = $scope.vm = {
		shiftTypes: []
	};

	shiftTypesSvc.ready.then(function (){
		vm.shiftTypes = shiftTypes();
	});

	function shiftTypes () {
			var absences = $scope.absences;
			var shiftTypesArr = [];
			for (var i = 0; i < absences.length; i++) {
				var obj = {}, shiftType;
				// Added condition to check typeof shiftType coming from api with absence object 
				// since in variaton Mode  shiftType coming as property whereAs in Day mode its coming as object ,	
				if(typeof(absences[i][propShiftType]) != 'object') {
					shiftType = (absences[i][propShiftType] && absences[i][propShiftType] > 0) ? shiftTypesSvc.oneById(absences[i][propShiftType]) : shiftTypesSvc.oneById(absences[i].shiftType);
				}
				else {
					shiftType = (absences[i][propShiftType] && absences[i][propShiftType]["id"] && absences[i][propShiftType]["id"] > 0) ? shiftTypesSvc.oneById(absences[i][propShiftType]["id"]) : shiftTypesSvc.oneById(absences[i].shiftType);
				}
				obj.cssClass = shiftType.cssClass;
				if(!institutionSvc.oneById(absences[i].institution.id).isAvailable){
					obj.cssClass += ' not-available';
				}				
				obj.mnemonic = shiftType.mnemonic;
				obj.title = shiftType.title;
				shiftTypesArr.push(obj);
			}
			return shiftTypesArr;
	}


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		someAction: function () {
			vm.property = 'something';
		}
	};
}

// #-- END Component (cmpt-template-shift-types) --# //
// #-----------------------------------------------# //
};});}());
