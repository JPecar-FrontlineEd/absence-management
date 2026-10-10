(function() {'use strict';angular.module('aesop')
.directive('cmptCallGroupExcludedList', function () {return {

// directive options
restrict: 'E',
scope: {
	isLoading:'=',
	data:'=',
	selected:'=',
	editing:'=',
	enabled:'=',
	userHrsVisibilityMode:'=',
	commentEntryBulkMode: '=?'
},
replace: true,
transclude:true,
templateUrl: '/components/call-group/cmpt-call-group-excluded-list/callGroupExcludedList.html',

// #---------------------------------------------------# //
// #---- Component (cmpt-call-group-excluded-list) ----# //
controller: function ($scope, stringSvc,permissionSvc,callGroupHelp,callGroupApi,schoolDetailsVal,toastHelp) {
	if ($scope.commentEntryBulkMode == null) {
		$scope.commentEntryBulkMode = false;
	}

	var strings = $scope.strings = stringSvc.getStrings([
		'Name',
		'Comments',
		'Select',
		'Action',
		'NoRating',
		'CallGroupPreferences.Validation.ExclusionComments.MinLength',
		'CallGroupPreferences.Validation.ExclusionComments.MaxLength',
		'CallGroupPreferences.Validation.ExclusionComments.Required'
	]);

	var callGroupId = schoolDetailsVal.callgroup.defaults.id;

	var nameIndex = 0,
		commentsIndex = 1,
		selectIndex = 2,
		actionIndex = 3;


	// View Model properties
	var vm = $scope.vm = {
		excludedColumns : [{
			key:'name',
			title:strings['Name'],
			template:'<div ng-if="row.substitute != null"> ' +
			'<cmpt-template-substitute-link substitute-id="{{ row.substitute.id }}" substitute-name="{{ row.substituteName }}" ></cmpt-template-substitute-link></div>'+
			'<cmpt-template-feedback-rating ng-if="row.canViewSubAvgScore" average-score="row.feedBackScore" total-number-of-rating="row.feedBackTotal"></cmpt-template-feedback-rating>' +
            '<div class="no-rating" ng-if="row.canViewSubAvgScore && row.feedBackScore <= 0">('+ strings['NoRating'] +')</div>'+
            '</div>',
			width:fractionClass('10/24' || '1')
		},{
			key:'comments',
			title:strings['Comments'] + '<span class="required-field" ng-if="editing && vm.requireCommentsWhenExcludingSubs">*</span>',
			template:`<span ng-if="vm.canViewComments" ng-show="!row.editMode">{{row.commentsExcluded}}</span>
						<cmpt-ui-textarea-v2
							ng-if="row.editMode && vm.canEditComments"
							name="commentsExcluded"
							value-text="row.commentsExcluded"
							form-value="rowForm.commentsExcluded"
							required="vm.requireCommentsWhenExcludingSubs"
							max-length="256"
							min-length="3"
							read-only="!row.editMode"
							update-on-blur>
							<div ng-message="required">{{strings['CallGroupPreferences.Validation.ExclusionComments.Required']}}</div>
							<div ng-message="minlength">{{strings['CallGroupPreferences.Validation.ExclusionComments.MinLength']}}</div>
							<div ng-message="maxlength">{{strings['CallGroupPreferences.Validation.ExclusionComments.MaxLength']}}</div>
						</cmpt-ui-textarea-v2>`,
			width:fractionClass('12/24' || '1')
		}],
		canEditList:permissionSvc.iHave('PREFLIST.Exclude') && permissionSvc.iHave('PREFLIST.Edit'),
		canViewComments : permissionSvc.iHave('PREFLIST.COMMENTVIEW'),
		canEditComments : permissionSvc.iHave('PREFLIST.COMMENTEDIT'),
		requireCommentsWhenExcludingSubs: schoolDetailsVal.requireCommentsWhenExcludingSubs
	};


	if ($scope.commentEntryBulkMode) {
		//pull the comments width out to the rest of the screen
		vm.excludedColumns[commentsIndex].width = fractionClass('14/24' || '1');

		$scope.data.forEach(function(ss) {
			//meta for proper binding
			ss.editMode = true;
			ss.substituteName = ss.fullName;
			ss.substitute = { id: ss.id };

			//tack on some call group preference fields.
			ss.commentsExcluded = null;
			ss.excluded = true;
		});

		//force the user to have edit comments permissions if exclusion comments are required
        //doing this only in "new" mode to allow forcing comments on new exclusions but not editing comments on existing ones.
		if (vm.requireCommentsWhenExcludingSubs && !vm.canEditComments)	{
			vm.canEditComments = true;
		}
	}

	if (!$scope.commentEntryBulkMode) {
		vm.excludedColumns.push({
			key:'select',
			title:strings['Select'],
			template:'<input type="checkbox" ng-model="row.selected" ng-click="col.onCheck(row)" ng-disabled="!row.editable || !enabled" ng-if="vm.canEditList" />',
			width:fractionClass('2/24' || '1'),
			onCheck:function (row) {
				if (row.selected && row.editMode) { row.selected = false; return; }
				if(row.selected && !$scope.enabled) {row.selected = false; return;}
				if (row.selected) {
					$scope.editing = true;
					$scope.selected.push(row);

				} else {
					$scope.selected = $scope.selected.filter(function (v) { return v !== row; });
					if($scope.selected.length === 0){
						$scope.editing = false;
					}


				}
			}
		});

		if (vm.canEditComments) {
			vm.excludedColumns[0].width = fractionClass('8/24' || '1');
			vm.excludedColumns.splice(vm.excludedColumns.length,0,{
				key:'action',
				title:strings['Action'],
				template:'<button title="Edit" ng-if="vm.canEditList" class="fl-button fa fa-pencil" ng-show="!row.editMode" ng-click="go.updateEditMode(row)" ng-class="{\'fl-disabled\':!row.editable || !enabled || selected.length != 0}"></button>'+
				'<button title="Cancel" class="fl-button fa fa-times" ng-show="row.editMode && !row.saving" ng-click="go.updateEditMode(row)"></button>'+
				'<button title="Save" class="fl-button fl-positive fa fa-check" ng-show="row.editMode && !row.saving" ng-click="go.updatePref(row, rowForm)" ng-class="{\'fl-disabled\':rowForm.$invalid}"></button>'+
	            '<button title="Saving" class="fl-button" ng-show="row.editMode && row.saving">saving...</button>',
				width:fractionClass('2/24' || '1')
			});
		}
	}


	if(!vm.canViewComments){
		vm.excludedColumns.splice(1,1);
		vm.excludedColumns.splice(2,1);
		vm.excludedColumns[nameIndex].width = fractionClass('22/24' || '1');

		if(!vm.canEditList){
			vm.excludedColumns.splice(1,2);
			vm.excludedColumns[nameIndex].width = fractionClass('24/24' || '1');
		}
	}else{
		if(!vm.canEditList){
			vm.excludedColumns.splice(2,2);
			vm.excludedColumns[nameIndex].width = fractionClass('12/24' || '1');
		}
	}




	function fractionClass(frac) {
			return '-u-' + frac.replace('/', '-');
	}

	function updateEditMode(row){
		if(!row.editMode){
			if(row.editable && $scope.enabled && $scope.selected.length === 0){
				row.editMode=true;
				$scope.editing = true;
				markAllUneditable();
				hideSelectRow();
			}



		}else{
			row.editMode=false;
			markAllEditable();
			$scope.editing = false;
			cancelChanges(row);
			showSelectRow();

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

	function hideSelectRow(){
		vm.excludedColumns[selectIndex].cls = 'ng-hide';
		vm.excludedColumns[commentsIndex].width=fractionClass('13/24' || '1');
		vm.excludedColumns[actionIndex].width=fractionClass('3/24' || '1');
	}

	function showSelectRow(){
		vm.excludedColumns[selectIndex].cls = '';
		vm.excludedColumns[commentsIndex].width=fractionClass('12/24' || '1');
		vm.excludedColumns[actionIndex].width=fractionClass('2/24' || '1');
	}

	function updateOriginals(row){
		row.origComments = row.commentsExcluded;
	}

	function updatePref(row, form){
		if (form.$invalid) {
			return;
		}

		var apiPref = callGroupHelp.prepareForAPICall(row);
		var callGroupPreferences = [apiPref];
		row.saving=true;
		callGroupApi.upsertPreferences({'id': callGroupId},callGroupPreferences)
                .then(function(prefs) {
                    markAllEditable();
                    updateOriginals(row);
                    $scope.editing = false;
                    showSelectRow();
        		}, function (reason) {
        			$scope.editing = false;
        			row.saving=false;
                      toastHelp.error(reason.$messages, 'Error');
        });

	}

	function cancelChanges(row){
		row.commentsExcluded = row.origCommentsExcluded;

	}

	// Get mnemonics that this component needs


	// Actions that can be bound to from the view
	var go = $scope.go = {
		updateEditMode:updateEditMode,
		updatePref:updatePref
	};
}

// #-- END Component (cmpt-call-group-excluded-list) --# //
// #---------------------------------------------------# //
};});}());