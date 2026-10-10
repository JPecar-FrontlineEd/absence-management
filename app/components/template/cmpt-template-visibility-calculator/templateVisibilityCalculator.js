(function() {'use strict';angular.module('aesop')
.directive('cmptTemplateVisibilityCalculator', function () {return {

// directive options
restrict: 'E',
scope: true,
replace: true,
templateUrl: '/components/template/cmpt-template-visibility-calculator/templateVisibilityCalculator.html',

// #---------------------------------------------------------# //
// #---- Component (cmpt-template-visibility-calculator) ----# //
controller: function ($filter, $scope, stringSvc, parseDateFilter, parseAesopDateFilter, timeFilter) {

	var today = new Date();
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate()+1);

	var dtToday = today;
	var dtJobBegin = tomorrow;

	//var dateVisibleOnFormat = 'MMM. d, yyyy<br/>h:mm tt';
    //var dateVisibleOnPercentagesFormat = 'M/d/yyyy<br/>hh:mm tt';

	// View Model properties
	var vm = $scope.vm = {
		dataSet: [],
		columns:[
            {
                key: 'percentNum', width: '5/24',
                name: 'Percent',
                noTitle: true,
                sortable: false,
                template:'{{row.percent}}',
                headerTemplate: '<span>%</span>'
            },
            {
                key: 'leadTime', width: '10/24',
                name: 'PreferredSub.Radio.Label.Text.LeadTime',
                sortable: false,
                noTitle: true,
                template:'{{row.leadTime}}'
            },
            {
                key: 'visibleOn', width: '9/24',
                name: 'VisibilityCal.Header.Text.VisibleOn',
                sortable: false,
                noTitle: true,
                template:'<div>{{row.visibleOnDate}}</div><div>{{row.visibleOnTime}}</div>'
            }],
        sort: {
        	byColumn: 'percentNum',
            direction: 'desc'
        },
        jobCreatedDate: dtToday,
        jobCreatedTime: timeFilter(dtToday, 'hh:mm T'),
        jobBeginDate: dtJobBegin,
        jobBeginTime: timeFilter(dtToday, 'hh:mm T'),
        visibleOnDateTime: '',
        visibilityPercentage: 50,
        visibilityPercentageText: 50,
        leadTime: '',
        resultLeadTime: ''
	};

	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'VisibilityCalc.Summar.Text',
		'VisibilityCalc.Label.Text.AbsenceCreatedOn',
		'VisibilityCalc.Label.Text.AbsenceBeginsOn',
		'PreferredSub.Radio.Label.Text.LeadTime',
		'VisibilityCalc.LeadTime.Format.Text',
		'Other',
		'VisibilityCal.Header.Text.VisibleOn'
	]);

	//initialize the table info and the results section
	createLeadTimePercentages();

	function createLeadTimePercentages(){
		validateTimes();
		vm.dataSet = [];
        for (var i = 100; i > 0; i -= 10) {
            var item = { percentNum: i, percent: i + '%' };
            item.leadTime = formatTimePeriod(leadTimeMinsPerc(parseInt(item.percentNum)), false);
            var dtVisibleOn = visibleOn(parseInt(item.percentNum));
            item.visibleOnDate = parseAesopDateFilter(dtVisibleOn);
            item.visibleOnTime = timeFilter(dtVisibleOn,'hh:mm TT');
            vm.dataSet.push(item);
        }
        vm.leadTime = formatTimePeriod(leadTimeMins(), true);
        generateResults();
	}

	function leadTimeMins(){
		var created = getCreatedDateTime();
        var start = getJobBeginDateTime();
        return (start - created) / (1000 * 60);
	}
	function leadTimeMinsPerc(percent){
		return leadTimeMins() * 0.01 * percent;
	}
	function visibleOn(percentage){
		var leadTimePerc = leadTimeMinsPerc(percentage);
        var dtVisibleOn = addMinutes(getJobBeginDateTime(),(-1 * leadTimePerc));
        //var tzOffset = self.JobBeginsOnDateTime().getTimezoneOffset() - dtVisibleOn.getTimezoneOffset();
        //if (self.TimezoneOffset() === 0)
        //    tzOffset = 0;
        //var dt = self.JobBeginsOnDateTime().addMinutes(-1 * leadTimePerc + tzOffset);
        return dtVisibleOn;
	}

	function generateResults() {
		vm.resultLeadTime = formatTimePeriod(leadTimeMinsPerc(parseInt(vm.visibilityPercentage)), true);
        vm.visibleOnDateTime = visibleOn(parseInt(vm.visibilityPercentage));
	}

	function getCreatedDateTime(){
		return new Date(parseAesopDateFilter(vm.jobCreatedDate) + ' ' + vm.jobCreatedTime);
	}
	function getJobBeginDateTime(){
		return new Date(parseAesopDateFilter(vm.jobBeginDate) + ' ' + vm.jobBeginTime);
	}
	function addMinutes(date, minutes) {
	    return new Date(date.getTime() + minutes*60000);
	}

	function validateTimes(){
		if (timeFilter(vm.jobCreatedTime,'hh:mm T') === '') {
			vm.jobCreatedTime = timeFilter(new Date(),'hh:mm T');
		} else {
			vm.jobCreatedTime = timeFilter(vm.jobCreatedTime,'hh:mm T');
		}
		if (timeFilter(vm.jobBeginTime,'hh:mm T') === '') {
			vm.jobBeginTime = timeFilter(new Date(),'hh:mm T');
		} else {
			vm.jobBeginTime = timeFilter(vm.jobBeginTime,'hh:mm T');
		}
	}

	function formatTimePeriod (totMins, timeFormat) {
        var hours = Math.floor(totMins / 60);
        var days = Math.floor(hours / 24);
        hours = hours % 24;
        var mins = Math.floor(totMins) % 60;
        var str = '';
        if (days < 0 || hours < 0 || mins < 0) {
            str = '-';
        }
        days = Math.abs(days);
        hours = Math.abs(hours);
        mins = Math.abs(mins);
        if (timeFormat) {
            str += ((days > 0) ? ((days < 10) ? '0' : '') + days : '00') + ':';
            str += ((days > 0 || hours > 0) ? ((hours < 10) ? '0' : '') + hours : '00') + ':';
            str += (mins > 0) ? ((mins < 10) ? '0' : '') + mins : '00';
        }
        else {
            str += (days > 0) ? days + 'd ': '';
            str += (days > 0 || hours > 0) ? hours + 'h ' : '';
            str += (days > 0 || hours > 0 || mins > 0) ? mins + 'm' : '';
        }
        return str;
    }

    function updateSlider(){
        var value = $filter('number')(vm.visibilityPercentageText);
        if(value.length > 0){
        	vm.visibilityPercentage = $filter('number')(vm.visibilityPercentageText);
        	angular.element('.ui-slider').slider('values', [parseInt(vm.visibilityPercentage)]);
        }
    }

	// Actions that can be bound to from the view
	var go = $scope.go = {
		createLeadTimePercentages: createLeadTimePercentages,
		updateSlider: updateSlider
	};

	$scope.$watchGroup(['vm.jobCreatedDate','vm.jobBeginDate'],function(){
		createLeadTimePercentages();
	});

	$scope.$watch('vm.visibilityPercentage', function(){
		vm.visibilityPercentageText = vm.visibilityPercentage;
		generateResults();
	});
}

// #-- END Component (cmpt-template-visibility-calculator) --# //
// #---------------------------------------------------------# //
};});}());