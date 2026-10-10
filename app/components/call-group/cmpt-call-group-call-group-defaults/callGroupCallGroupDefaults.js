(function() {'use strict';angular.module('aesop')
.directive('cmptCallGroupCallGroupDefaults', function () {return {

// directive options
restrict: 'E',
scope: {
	userHrsVisibilityMode:'=',
	defaultsDirty:'=',
	editable:'='
},
replace: true,
templateUrl: '/components/call-group/cmpt-call-group-call-group-defaults/callGroupCallGroupDefaults.html',

// #---------------------------------------------------------# //
// #---- Component (cmpt-call-group-call-group-defaults) ----# //
controller: function ($scope,institutionSvc,stringSvc,schoolDetailsVal,callGroupApi,toastHelp,dateHelp,permissionSvc,callGroupHelp) {

	// View Model properties
	var defaults = schoolDetailsVal.callgroup.defaults;
	var vm = $scope.vm = {
		defaults:angular.copy(schoolDetailsVal.callgroup.defaults),
		orgMinHrs:dateHelp.getHrsFromMins(defaults.minVisibilityMinutes),
		minHrs:dateHelp.getHrsFromMins(defaults.minVisibilityMinutes),
		visibilityPercent:defaults.visibilityPercent,
		origPerLeadTime:defaults.visibilityPercent,
		orgMinsMins:dateHelp.getHrsRemainingMinsFromMins(defaults.minVisibilityMinutes),
		minMins:dateHelp.getHrsRemainingMinsFromMins(defaults.minVisibilityMinutes),
		origMaxDays:dateHelp.getDaysFromMins(defaults.maxVisibilityMinutes),
		maxDays:dateHelp.getDaysFromMins(defaults.maxVisibilityMinutes),
		origMaxHrs:dateHelp.getDaysRemainingHrsFromMins(defaults.maxVisibilityMinutes),
		maxHrs:dateHelp.getDaysRemainingHrsFromMins(defaults.maxVisibilityMinutes),
		visHours:defaults.visibilityHours,
		origCallGroupOrder:defaults.callGroupOrder,
		origVisibilityDays:dateHelp.getDaysFromMins(defaults.visibilityHours*60),
		visibilityDays:dateHelp.getDaysFromMins(defaults.visibilityHours*60),
		origVisibilityHours:dateHelp.getHrsRemainingMinsFromMins(defaults.visibilityHours*60),
		visibilityHours:dateHelp.getHrsRemainingMinsFromMins(defaults.visibilityHours*60),
		canSave:false,
		saving:false,
		canEditList:permissionSvc.iHave('PREFLIST.Edit'),
		validationMessages:[],
		visPerErrors : [],
        visHrErrors : [],
        minMinErrors : [],
        minHrErrors : [],
        maxDaysErrors : [],
        maxHrsErrors : [],
        visDaysErrors : []
	};





	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Defaults',
		'PreferredSub.Label.Text.CallingSequence',
		'PreferredSub.Label.Text.UseCallOrder',
		'PreferredSub.Label.Text.UseRandomOrder',
		'PreferredSub.Button.Text.JobVisibility',
		'Days',
		'Hrs',
		'PreferredSub.Button.Text.JobVisibility',
		'PreferredSub.Radio.Label.Text.LeadTime',
		'VisibilityCalculator.Dialog.Text',
		'Min',
		'Hrs',
		'Mins',
		'Max',
		'PreferredSub.Button.Text.SavingDefaults',
		'PreferredSub.Button.Text.SaveDefaults',
		'Error',
		'Dismiss'


	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {
		save: saveDefaults,
		cancel:revertValues,
		visibilityCalculator: institutionSvc.showVisibilityCalculator
	};



	function revertValues(){
		if(vm.canSave){
			vm.minHrs = vm.orgMinHrs;
			vm.minMins = vm.orgMinsMins;
			vm.maxDays = vm.origMaxDays;
			vm.maxHrs = vm.origMaxHrs;
			vm.visibilityDays = vm.origVisibilityDays;
			vm.visibilityHours = vm.origVisibilityHours;
			vm.defaults.visibilityPercent = vm.origPerLeadTime;
			vm.defaults.callGroupOrder = vm.origCallGroupOrder;
			vm.canSave = false;
			$scope.defaultsDirty=false;
			vm.validationMessages=[];
			vm.visPerErrors = [];
	        vm.visHrErrors = [];
	        vm.minMinErrors = [];
	        vm.minHrErrors = [];
	        vm.maxDaysErrors = [];
	        vm.maxHrsErrors = [];
	        vm.visDaysErrors = [];
		}
	}

	function saveDefaults(){
		if(vm.canSave){
			vm.saving = true;
			$scope.editable=false;
			vm.defaults.minVisibilityMinutes = dateHelp.getMinsFromHrsAndMinutes(parseInt(vm.minHrs), parseInt(vm.minMins));
			vm.defaults.maxVisibilityMinutes = dateHelp.getMinutesFromDaysAndHrs(parseInt(vm.maxDays), parseInt(vm.maxHrs));
			vm.defaults.visibilityHours = dateHelp.getHrsFromDaysAndHrs(parseInt(vm.visibilityDays), parseInt(vm.visibilityHours));
			vm.validationMessages=[];
			vm.visPerErrors = [];
	        vm.visHrErrors = [];
	        vm.minMinErrors = [];
	        vm.minHrErrors = [];
	        vm.maxDaysErrors = [];
	        vm.maxHrsErrors = [];
	        vm.visDaysErrors = [];
	        vm.minMins = parseInt(vm.minMins);
	        vm.minHrs = parseInt(vm.minHrs);
	        vm.maxHrs = parseInt(vm.maxHrs);
	        vm.maxDays = parseInt(vm.maxDays);
	        console.log(vm.defaults.visibilityPercent);
	        vm.defaults.visibilityPercent = parseInt(vm.defaults.visibilityPercent);
	        vm.visibilityDays = parseInt(vm.visibilityDays);
	        vm.visibilityHours = parseInt(vm.visibilityHours);
	        vm.visibilityPercent = vm.defaults.visibilityPercent;
	        //vm.visibilityHours = vm.defaults.visibilityHours;

			var apiCallGroup = {
				id : vm.defaults.id,
				callGroupOrder :vm.defaults.callGroupOrder,
				name:vm.defaults.name,
				orgId:vm.defaults.orgId,
				ownerType:vm.defaults.ownerType,
				ownerId:vm.defaults.ownerId,
				maxVisibilityMinutes:vm.defaults.maxVisibilityMinutes,
				minVisibilityMinutes :vm.defaults.minVisibilityMinutes,
				visibilityHours :vm.defaults.visibilityHours,
				visibilityPercent :vm.defaults.visibilityPercent,
				lastSortTime :vm.defaults.lastSortTime,
				nextRoundRobinIndex :vm.defaults.nextRoundRobinIndex,

			};

			if(validatePref(vm)){
				callGroupApi.saveDefaults({'id': vm.defaults.id}, apiCallGroup)
						.then(function(defaults) {
							vm.saving = false;
							vm.canSave = false;
							resetSchoolDetailsValDefaults(apiCallGroup);
							$scope.defaultsDirty=false;
							$scope.$emit('defaultsUpdated', { message: 'updated' });
							//$scope.editable=true;
						}, function (reason) {
							vm.saving = false;
							//vm.canSave = false;
							$scope.editable=true;
							toastHelp.error(reason.$messages, 'Error');
						});
			}else{
				vm.saving=false;
				$scope.editable=true;
			}

		}
	}

	function validatePref(row){
		var valid = true;
		if($scope.userHrsVisibilityMode){
			if(!callGroupHelp.isHoursValid(row)){
				valid = false;
			}
			if(!callGroupHelp.isDaysValid(row)){
				valid = false;
			}

		}else{
			if(!callGroupHelp.isLeadTimePercentageValid(row)){
				valid = false;
			}
			if(!callGroupHelp.isMinHoursValid(row)){
				valid =  false;
			}
			if(!callGroupHelp.isMinMinsValid(row)){
				valid =  false;
			}
			if(!callGroupHelp.isMaxDaysValid(row)){
				valid =  false;
			}
			if(!callGroupHelp.isMaxHoursValid(row)){
				valid =  false;
			}
			if(!callGroupHelp.isMinTimeLessMaxTime(row)){
				valid =  false;
			}
		}



		return valid;
	}

	function resetSchoolDetailsValDefaults(defaults){
		Object.keys(schoolDetailsVal.callgroup.defaults).forEach(function (key) {
				delete schoolDetailsVal.callgroup.defaults[key];
		});

		angular.extend(schoolDetailsVal.callgroup.defaults,defaults);

	}

	$scope.$watch('vm.minHrs', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.orgMinHrs){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.minMins', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.orgMinsMins){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.maxDays', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.origMaxDays){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.maxHrs', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.origMaxHrs){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.defaults.visibilityPercent', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.origPerLeadTime){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.defaults.callGroupOrder', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.origCallGroupOrder){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.visibilityDays', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.origVisibilityDays){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});
	$scope.$watch('vm.visibilityHours', function (newValue,oldValue) {
			if(newValue !== oldValue && newValue !== vm.origVisibilityHours){
				vm.canSave = true;
				$scope.defaultsDirty=true;
			}
	});

}

// #-- END Component (cmpt-call-group-call-group-defaults) --# //
// #---------------------------------------------------------# //
};});}());