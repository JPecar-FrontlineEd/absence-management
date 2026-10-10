(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrVariationHeader', function () {return {

// directive options
restrict: 'E',
scope: {
	variationData:'=',
	datesOnly:'=',
},
transclude:true,
replace: true,
templateUrl: '/components/absr/cmpt-absr-variation-header/absrVariationHeader.html',

// #------------------------------------------------# //
// #---- Component (cmpt-absr-variation-header) ----# //
controller: function ($scope, stringSvc, institutionSvc, absrStateVal, absrVariationHelp) {

	var absrState = $scope.absrState = absrStateVal;
	var variationData = $scope.variationData;
	// View Model properties
	var vm = $scope.vm = {
		variationNumber: null, //absrState.absrVariations.indexOf(variationData) + 1,
		instId: 0,
		institutionName: '',
		dateString: '',
		lockedTemplate: ''
	};

	if ($scope.variationData.absences) {
		vm.absenceCount = $scope.vm.absenceCount = $scope.variationData.absences.length;
		vm.reconciled = $scope.vm.reconciled = $scope.variationData.absences.filter(function(absence) {
			return absence.isReconciled;
		}).length;
	}

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Variation',
		'Absence.Variation.Validation.Date',
		'NoSchoolSelected',
		'Absence.Variation.ReadOnlyMessage.TooltipTitle',
		'Absence.Variation.ReadOnlyMessage.Summary'
	]);

	vm.lockedTemplate = '{{ strings["Absence.Variation.ReadOnlyMessage.Summary"] }} ' +
			'<span qtip ' +
				'title="{{ strings[\'Absence.Variation.ReadOnlyMessage.TooltipTitle\'] }}" ' +
				'content="<div>{{ variationData.readOnlyReason }}</div>"><i class="fa fa-question-circle"></i></span>';

	institutionSvc.ready.then(function () {
		if(!$scope.datesOnly){
			$scope.$watch('variationData.institution', function (inst){
				if(inst){
					vm.instId = inst.id;
					vm.institutionName = institutionSvc.oneById(inst.id).name;
				}else{
					vm.institutionName = strings['NoSchoolSelected'];
				}
			});
		}
	});

	$scope.$watchCollection('absrState.absrVariations', function (){
		vm.variationNumber = absrState.absrVariations.indexOf(variationData) + 1;
	});

	$scope.$watchCollection('variationData.dates', function (nVal){
		if(nVal.length > 0){
			vm.dateString = absrVariationHelp.dateString(nVal,absrState.context.dragSelectDOW);
		}else{
			vm.dateString = strings['Absence.Variation.Validation.Date'];
		}
	});

	if (vm.absenceCount === 1) {
		$scope.$watch('variationData.absences[0].isReconciled',
			function () {
				vm.reconciled = $scope.vm.reconciled = $scope.variationData.absences.filter(function (absence) {
					return absence.isReconciled;
				}).length;
			});
	}

	// Actions that can be bound to from the view
	var go = $scope.go = {
	};

}

// #-- END Component (cmpt-absr-variation-header) --# //
// #------------------------------------------------# //
};});}());