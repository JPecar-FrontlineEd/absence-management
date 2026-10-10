(function() {'use strict';angular.module('aesop')
.directive('cmptUiDateSelectorWithInput', function () {return {

// directive options
restrict: 'E',
scope: {
	dateModel: '=?',
	gotError:'=',
	maxDate: '=?',
	minDate: '=?',
	label: '=?',
    reportType: '=?',
    filters:'=?'
},
replace: true,
templateUrl: '/components/ui/cmpt-ui-date-selector-with-input/uiDateSelectorWithInput.html',

// #---------------------------------------# //
// #---- Component (cmpt-ui-date-selector-with-input) ----# //
controller: function ($scope, ngDialog, $rootScope) {

    var datePickerOpen = false;

	// Actions that can be bound to from the view
	var go = $scope.go = {
        setDate: function (date) {
            if (date == undefined){
                date = (new Date($scope.dateModel)).toString("MM/dd/yyyy");
            }
            $scope.$el.datepicker('setDate', date);
        },
        search: function () {
            $rootScope.$emit("searchfromDatePickerInputBox", vm.dateModel);
        },
		select: function (newDate) {
			$scope.$root.safeApply(function () {
				go.setDate(newDate);
                $scope.dateModel = $scope.$el.datepicker('getDate');
                $scope.filters.date = $scope.dateModel;
                datePickerOpen = true;
            });
        },
        blur:function(){
			if(!datePickerOpen){
				go.select($scope.$el.val());
			}
		}
    };

	// View Model properties
	var vm = $scope.vm = {
        jqInputPlugins: {
			datepicker: {
                onSelect: go.select,
				maxDate:$scope.maxDate,
				minDate:$scope.minDate,
                beforeShow:function(input, inst){
					datePickerOpen=true;
                    // It's not supported by Datepicker itself (for now) so we need to use its internal variables.
                    var calendar = inst.dpDiv;

                    // Dirty hack, but we can't do anything without it (for now, in jQuery UI 1.8.20)
                    setTimeout(function() {
                        calendar.position({
                            my: 'center top',
                            at: 'right bottom',
                            collision: 'none',
                            of: input
                        });
                    }, 1);
                },
                onClose:function(){
                    datePickerOpen=false;
                }
			}
        }
    };

    vm.dateModel = (new Date($scope.dateModel)).toString("MM/dd/yyyy");

    $scope.$watch('$el',function (el) {
		if (el) {

			el.on("loadComplete", function(){
                if(datePickerOpen){
                    datePickerOpen=false;
                    $(".date-selector-with-input-content").parent().hide();
                    $('.sk-auto-collapse-nav-gte').removeClass('ngdialog-open');
                    ngDialog.closeAll();
                }
                else{
                    $(".date-selector-with-input-content").parent().show();
                }

                $(".date-selector-with-input").parent().addClass('date-selector-with-input-content');
                $(".date-selector-with-input").parent().prev().addClass('date-selector-with-input-overlay');

                //considering 81 is the actual margin from top;
                var pickerTopMargin	= 81 - window.pageYOffset;
                var pickerWidth = $(".previous").offset().left - 5;
                $(".date-selector-with-input-content").attr('style', 'margin: ' + pickerTopMargin + 'px 0px 0px ' + pickerWidth +'px; top: 0px');
            });

            $scope.$watch('vm.dateModel', function (newDate) {
                go.setDate(newDate);
            });
        }
    });
},
link: function (scope, element, attrs) {
	scope.$el = element.find('div');
}

// #-- END Component (cmpt-ui-date-selector-with-input) --# //
// #---------------------------------------# //
};});}());