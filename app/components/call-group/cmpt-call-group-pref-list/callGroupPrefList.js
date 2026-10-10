(function() {'use strict';angular.module('aesop')
.directive('cmptCallGroupPrefList', function () {return {

// directive options
restrict: 'E',
scope: {
	isLoading:'=',
	data:'=',
	selected:'=',
	editing:'=',
	enabled:'=',
	reorderDirty:'=',
	userHrsVisibilityMode:'=',
	showOrder:'='
},
replace: true,
transclude:true,
templateUrl: '/components/call-group/cmpt-call-group-pref-list/callGroupPrefList.html',

// #-----------------------------------------------# //
// #---- Component (cmpt-call-group-pref-list) ----# //
controller: function ($scope, stringSvc,schoolDetailsVal,callGroupApi,dateHelp,toastHelp,orgSvc,permissionSvc,callGroupHelp) {


	var callGroupId = schoolDetailsVal.callgroup.defaults.id;
	var orgData = orgSvc.getOrgData();
	var userHrsVisMode = orgData[0].settings.UserHrsVisMode;

	var orderRowIndex = 0,
		nameIndex = 1,
		leadTimeIndex = 2,
		minVisibilityIndex = 3,
		maxVisibilityIndex = 4,
		commentsIndex = 5,
		selectIndex = 6,
		actionIndex = 7;


	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'Order',
		'Name',
		'PreferredSub.Header.Text.Visibility',
		'PreferredSub.Radio.Label.Text.LeadTime',
		'PreferredSub.Header.Text.Visibility',
		'PreferredSub.Header.Text.MinVisibility',
		'PreferredSub.Header.Text.MaxVisibility',
		'Hrs',
		'Mins',
		'Days',
		'Comments',
		'Select',
		'Action',
		'NoRating',
		'Error',
		'CallGroup.Text.EnterValidLeadTime',
		'CallGroup.Text.LeadTimeCannotBeLessThanZero',
		'CallGroup.Text.LeadTimeCannotBeGreaterThanHundred',
		'CallGroup.Text.MinVisibilityCannotExceedMaxVisibility',
		'CallGroup.Text.MinHoursShouldBeNumber',
		'CallGroup.Text.CallGroup.Text.MinHoursCannotBeLessThanZero',
		'CallGroup.Text.MinHoursCannotBeLessThanZero',
		'CallGroup.Text.MinVisibilityCannotBeGreaterThan240Hours',
		'CallGroup.Text.MinMinutesShouldBeNumber',
		'CallGroup.Text.MinMinutesCannotBeLessThanZero',
		'CallGroup.Text.MinMinutesCannotBeGreaterThan59',
		'CallGroup.Text.MaxDaysShouldBeNumber',
		'CallGroup.Text.MaxVisibilityCannotBeLessThanZero',
		'CallGroup.Text.MaxVisibilityCannotBeGreaterThan120',
		'CallGroup.Text.MaxHoursShouldBeNumber',
		'CallGroup.Text.MaxHoursCannotBeLessThanZero',
		'CallGroup.Text.MaxHoursCannotBeGreaterThan23',
		'CallGroup.Text.HoursShouldBeNumber',
		'CallGroup.Text.HoursCannotBeLessThanZero',
		'CallGroup.Text.HoursCannotBeGreaterThan60',
		'CallGroup.Text.DaysShouldBeNumber',
		'CallGroup.Text.DaysCannotBeLessThanZero',
		'CallGroup.Text.DaysBeGreaterThan120'
	]);

	function fractionClass(frac) {
			return '-u-' + frac.replace('/', '-');
	}

	$scope.$watch('showOrder', function (newValue,oldValue) {
            if(newValue !== oldValue){
            	vm.preferredColumns[0].cls=!$scope.showOrder ? 'ng-hide' : '';
            	vm.preferredColumns[1].cls =!$scope.showOrder ? 'no-order' : '';
            }
    });


	var vm = $scope.vm = {
		schoolDetails:schoolDetailsVal,
		opts:{'containment':'.grid-rows'},
		preferredColumns : [{
			key:'order',
			title:strings['Order'],
			subHeader:'',
			template:'<div ng-show="selected.length===0 && (enabled || reorderDirty)"><i ng-show="vm.canEditList" sv-handle class="fa fa-ellipsis-v drag-handle" ></i><span ng-show="!row.editMode">{{row.order}}</span></div>',
			width:fractionClass('2/24' || '1'),
			cls:!$scope.showOrder ? 'ng-hide' : ''
		},{
			key:'name',
			title:strings['Name'],
			subHeader:'',
			extraClassArray:[],
			extraClass:'',
			cls:!$scope.showOrder ? 'no-order' : '',
			template:'<div ng-if="row.substitute != null"> ' +
			'<cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link></div>'+
			'<cmpt-template-feedback-rating ng-if="row.canViewSubAvgScore" average-score="row.feedBackScore" total-number-of-rating="row.feedBackTotal"></cmpt-template-feedback-rating>' +
            '<div class="no-rating" ng-if="row.canViewSubAvgScore && row.feedBackScore <= 0">('+ strings['NoRating'] +')</div>'+
            '</div>',
			width:fractionClass('5/24' || '1')
		},{
			key:'leadTime',
			subHeader:'',
			title:'% '+strings['PreferredSub.Radio.Label.Text.LeadTime'],
			template:'<cmpt-ui-textbox value-text="row.visibilityPercent" read-only="!row.editMode" enabled=true error-messages="row.visPerErrors"></cmpt-ui-textbox>',
			width:fractionClass('3/24' || '1')
		},{
			key:'minVisibility',
			subHeader:'<div>'+strings['Hrs']+'</div><div>Mins</div>',
			title:strings['PreferredSub.Header.Text.MinVisibility'],
			template:'<div class="sub-cell"><cmpt-ui-textbox value-text="row.minHrs" read-only="!row.editMode" enabled=true error-messages="row.minHrErrors"></cmpt-ui-textbox></div>'+
			'<div class="sub-cell"><cmpt-ui-textbox value-text="row.minMins" read-only="!row.editMode" enabled=true error-messages="row.minMinErrors"></cmpt-ui-textbox></div>',
			width:fractionClass('2/24' || '1')
		},{
			key:'maxVisibility',
			subHeader:'<div>'+strings['Days']+'</div><div>'+strings['Hrs']+'</div>',
			title:strings['PreferredSub.Header.Text.MaxVisibility'],
			template:'<div class="sub-cell"><cmpt-ui-textbox value-text="row.maxDays" read-only="!row.editMode" enabled=true error-messages="row.maxDaysErrors"></cmpt-ui-textbox></div>'+
			'<div class="sub-cell"><cmpt-ui-textbox value-text="row.maxHrs" read-only="!row.editMode" enabled=true error-messages="row.maxHrsErrors"></cmpt-ui-textbox></div>',
			width:fractionClass('2/24' || '1')
		},{
			key:'comments',
			subHeader:'',
			extraClassArray:[],
			extraClass:'',
			title:strings['Comments'],
			template:'<span ng-if="vm.canViewComments" ng-show="!row.editMode">{{row.comments}}</span><cmpt-ui-textarea ng-if="vm.canEditComments" text-model="row.comments" ng-show="row.editMode" characters="256"></cmpt-ui-textarea >',
			width:fractionClass('6/24' || '1')
		},{
			key:'select',
			subHeader:'',
			title:strings['Select'],
			template:'<input type="checkbox" ng-model="row.selected" ng-click="col.onCheck(row)" ng-disabled="!row.editable || !enabled" ng-if="vm.canEditList" />',
			width:fractionClass('2/24' || '1'),
			onCheck:function (row) {
				if (row.selected && row.editMode) { row.selected = false; return; }
				if(row.selected && !$scope.enabled) {row.selected = false; return;}
				if (row.selected) {
					//$scope.editing = true;
					$scope.$emit('prefediting', { message: true });
					$scope.selected.push(row);

				} else {

					$scope.selected = $scope.selected.filter(function (v) { return v !== row; });
					if($scope.selected.length === 0){
						$scope.$emit('prefediting', { message: false });
						//$scope.editing = false;
					}

				}
			}
		},{
			key:'action',
			subHeader:'',
			title:strings['Action'],
			template:'<button title="Edit" ng-if="vm.canEditList" class="fl-button fa fa-pencil" ng-show="!row.editMode" ng-click="go.updateEditMode(row)" ng-class="{\'fl-disabled\':!row.editable || !enabled || selected.length != 0}"></button>'+
			'<button title="Cancel" class="fl-button fa fa-times" ng-show="row.editMode" ng-click="go.updateEditMode(row)"></button>'+
			'<button title="Save" class="fl-button fl-positive fa fa-check" ng-show="row.editMode && !row.saving" ng-click="go.updatePref(row)"></button>'+
            '<button title="Saving" class="fl-button fl-positive" ng-show="row.editMode && row.saving"><i class="fa-spin fa-spinner"></i></button>',
			width:fractionClass('2/24' || '1')
		}],
		canEditList: permissionSvc.iHave('PREFLIST.Edit'),
		canViewComments : permissionSvc.iHave('PREFLIST.COMMENTVIEW'),
		canEditComments : permissionSvc.iHave('PREFLIST.COMMENTEDIT')
	};


	/////////////// Visibility of columns ///////////////////////////////////////////////////
	/* Column widths controlled through css */


	//if we have org flag set to show hrs visibility mode and not percent remove and add columns
	if($scope.userHrsVisibilityMode){
		vm.preferredColumns.splice(2,3,{
			key:'hrsVisibility',
			subHeader:'<div>'+strings['Days']+'</div><div>'+strings['Hrs']+'</div>',
			title:strings['PreferredSub.Header.Text.Visibility'],
			template:'<div class="sub-cell"><cmpt-ui-textbox value-text="row.visibilityDays" read-only="!row.editMode" enabled=true error-messages="row.visDaysErrors"></cmpt-ui-textbox></div>'+
			'<div class="sub-cell"><cmpt-ui-textbox value-text="row.visibilityHours" read-only="!row.editMode" enabled=true error-messages="row.visHrErrors"></cmpt-ui-textbox></div>',
			width:fractionClass('2/24' || '1')
		});

		vm.preferredColumns[nameIndex].extraClassArray.push('hrs-visibility-mode');
		vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');

		if(vm.canViewComments){ //have comments visibility
			vm.preferredColumns[commentsIndex-2].extraClassArray.push('hrs-visibility-mode');
			vm.preferredColumns[commentsIndex-2].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');

			if(!vm.canEditList){ //dont have permission to edit list
				vm.preferredColumns.splice(4,2);
				vm.preferredColumns[nameIndex].extraClassArray.push('no-edit');
				vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');
			}
		}else{  //don't have comments visibility
			vm.preferredColumns.splice(3,1);
			vm.preferredColumns[nameIndex].extraClassArray.push('no-comments');
			vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');

			if(!vm.canEditList){  //don't have permission to edit list
				vm.preferredColumns.splice(3,2);
				vm.preferredColumns[nameIndex].extraClassArray.push('no-edit');
				vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');
			}
		}



	}else{

		//if don't have permission to view comments remove that column
		if(!vm.canViewComments){
			vm.preferredColumns.splice(5,1);
			vm.preferredColumns[nameIndex].extraClassArray.push('no-comments');
			vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');

			if(!vm.canEditList){  //don't have permission to edit list
				vm.preferredColumns.splice(5,2);
				vm.preferredColumns[nameIndex].extraClassArray.push('no-edit');
				vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');
			}
		}else{
			if(!vm.canEditList){  //don't have permission to edit list
				vm.preferredColumns.splice(6,2);
				vm.preferredColumns[nameIndex].extraClassArray.push('no-edit');
				vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');
			}
		}

	}


	function updateEditMode(row){
		if(!row.editMode){
			if(row.editable && $scope.enabled && $scope.selected.length === 0){
				row.editMode=true;
				$scope.$emit('prefediting', { message: true });
				//$scope.editing = true;
				markAllUneditable();
				hideOrderAndSelectRow();
			}



		}else{
			row.editMode=false;
			markAllEditable();
			$scope.$emit('prefediting', { message: false });
			//$scope.editing = false;
			cancelChanges(row);
			showOrderRow();


		}
	}

	function markAllUneditable(row){
		var otherItems = $scope.data.filter(function(r){return r !== row; });
		for(var x=0; x<otherItems.length; x++){
			otherItems[x].editable= false;
		}
	}

	function markAllEditable(){
		for(var x=0; x<$scope.data.length; x++){
			$scope.data[x].editable= true;
			$scope.data[x].editMode =false;
			$scope.data[x].saving=false;
		}
	}

	function hideOrderAndSelectRow(){

		vm.preferredColumns[orderRowIndex].cls = 'ng-hide';
		vm.preferredColumns[nameIndex].extraClassArray.push('edit-mode');
		vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[nameIndex].extraClassArray.join(' ');

		if(!vm.canViewComments){
			if($scope.userHrsVisibilityMode){
				vm.preferredColumns[selectIndex-3].cls = 'ng-hide';
				vm.preferredColumns[actionIndex-3].width=fractionClass('3/24' || '1');
			}else{
				vm.preferredColumns[selectIndex-1].cls = 'ng-hide';
				vm.preferredColumns[actionIndex-1].width=fractionClass('3/24' || '1');
			}

		}else{
			if($scope.userHrsVisibilityMode){
				vm.preferredColumns[selectIndex-2].cls = 'ng-hide';
				vm.preferredColumns[actionIndex-2].width=fractionClass('3/24' || '1');
				vm.preferredColumns[commentsIndex-2].extraClassArray.push('edit-mode');
				vm.preferredColumns[commentsIndex-2].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');
			}else{
				vm.preferredColumns[selectIndex].cls = 'ng-hide';
				vm.preferredColumns[actionIndex].width=fractionClass('3/24' || '1');
			}

		}

		var i = $scope.data.length;
		for(; i--;){
			$scope.data[i].cls = 'no-order';
		}


	}

	function showOrderRow(){

		if($scope.showOrder){
			vm.preferredColumns[orderRowIndex].cls = '';
		}
		vm.preferredColumns[nameIndex].extraClassArray.pop();
		vm.preferredColumns[nameIndex].extraClass=vm.preferredColumns[nameIndex].extraClassArray.join(' ');

		if(!vm.canViewComments){
			if($scope.userHrsVisibilityMode){
				vm.preferredColumns[selectIndex-3].cls = '';
				vm.preferredColumns[actionIndex-3].width=fractionClass('2/24' || '1');
			}else{
				vm.preferredColumns[selectIndex-1].cls = '';
				vm.preferredColumns[actionIndex-1].width=fractionClass('2/24' || '1');
			}
		}else{
			if($scope.userHrsVisibilityMode){
				vm.preferredColumns[selectIndex-2].cls = '';
				vm.preferredColumns[actionIndex-2].width=fractionClass('2/24' || '1');
				vm.preferredColumns[commentsIndex-2].extraClassArray.pop();
				vm.preferredColumns[commentsIndex-2].extraClass=vm.preferredColumns[1].extraClassArray.join(' ');
			}else{
				vm.preferredColumns[selectIndex].cls = '';
				vm.preferredColumns[actionIndex].width=fractionClass('2/24' || '1');
			}

		}
		var i = $scope.data.length;
		for(; i--;){
			$scope.data[i].cls = '';
		}
	}

	function cancelChanges(row){
		row.visibilityPercent = row.origVisibilityPercent;
		row.visibilityHours = row.origVisibilityHours;
		row.visibilityDays = row.origVisibilityDays;
		row.maxDays = row.origMaxDays;
		row.maxHrs = row.origMaxHrs;
		row.minHrs= row.origMinHrs;
		row.minMins = row.origMinsMins;
		row.comments = row.origComments;
		row.validationMessages = [];
		row.visPerErrors = [];
        row.visHrErrors = [];
        row.visDaysErrors = [];
        row.minMinErrors = [];
        row.minHrErrors = [];
        row.maxDaysErrors = [];
        row.maxHrsErrors = [];
	}

	function updateOriginals(row){
		row.origVisibilityPercent = row.visibilityPercent;
		row.origVisibilityHours = row.visibilityHours;
		row.origVisibilityDays = row.visibilityDays;
		row.origMaxDays = row.maxDays;
		row.origMaxHrs = row.maxHrs;
		row.origMinHrs = row.minHrs;
		row.origMinsMins = row.minMins;
		row.origComments = row.comments;
		row.validationMessages = [];
		row.visPerErrors = [];
        row.visHrErrors = [];
        row.visDaysErrors = [];
        row.minMinErrors = [];
        row.minHrErrors = [];
        row.maxDaysErrors = [];
        row.maxHrsErrors = [];
	}



	function updatePref(row){
		var apiPref = callGroupHelp.prepareForAPICall(row);
		var callGroupPreferences = [apiPref];
		row.validationMessages = [];
		row.visPerErrors = [];
        row.visHrErrors = [];
        row.visDaysErrors = [];
        row.minMinErrors = [];
        row.minHrErrors = [];
        row.maxDaysErrors = [];
        row.maxHrsErrors = [];
        row.minMins = parseInt(row.minMins);
        row.minHrs = parseInt(row.minHrs);
        row.maxHrs = parseInt(row.maxHrs);
        row.maxDays = parseInt(row.maxDays);
        row.visibilityPercent = parseInt(row.visibilityPercent);
        row.visibilityDays = parseInt(row.visibilityDays);
        row.visibilityHours = parseInt(row.visibilityHours);
		if(validatePref(row)){
			row.saving=true;
			callGroupApi.upsertPreferences({'id': callGroupId},callGroupPreferences)
	                .then(function(prefs) {
	                	updateOriginals(row);
	                    markAllEditable();
	                    $scope.$emit('prefediting', { message: false });
	                    //$scope.editing = false;
	                    showOrderRow();
	        		}, function (reason) {
	                      toastHelp.error(reason.$messages, 'Error');
	        });
        }
	}

	function validatePref(row){
		var valid = true;
		if(userHrsVisMode){
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
				valid = false;
			}
			if(!callGroupHelp.isMinMinsValid(row)){
				valid = false;
			}
			if(!callGroupHelp.isMaxDaysValid(row)){
				valid = false;
			}
			if(!callGroupHelp.isMaxHoursValid(row)){
				valid = false;
			}
			if(!callGroupHelp.isMinTimeLessMaxTime(row)){
				valid = false;
			}
		}



		return valid;
	}






	// Actions that can be bound to from the view
	var go = $scope.go = {
		updateEditMode:updateEditMode,
		updatePref:updatePref,
		Renumber:function (){
			var order = 0;
			$scope.data.forEach(function (item){
				item.order = ++order;
			});
			$scope.reorderDirty=true;

			//console.log(' => testing', $scope.data); // REMOVE ME
		}
	};


}

// #-- END Component (cmpt-call-group-pref-list) --# //
// #-----------------------------------------------# //
};});}());
