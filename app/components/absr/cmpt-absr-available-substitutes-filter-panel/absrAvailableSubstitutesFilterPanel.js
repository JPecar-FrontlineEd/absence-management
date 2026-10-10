(function() {'use strict';angular.module('aesop')
.directive('cmptAbsrAvailableSubstitutesFilterPanel', function () {return {

// directive options
restrict: 'E',
scope: {
	showQualified: '=',
	filter: '='
},
replace: true,
templateUrl: '/components/absr/cmpt-absr-available-substitutes-filter-panel/absrAvailableSubstitutesFilterPanel.html',

// #------------------------------------------------------------------# //
// #---- Component (cmpt-absr-available-substitutes-filter-panel) ----# //
controller: function ($scope, absrStateVal, $stateParams,stringSvc) {



	// View Model properties
	var vm = $scope.vm = {
		enteredTime:'',
		leadTime:'',
		leadPercentage:0,
		showLeadTimeMsg:false,
		leadTimeMsg:''
	};
	
	// Get mnemonics that this component needs
	var strings = $scope.strings = stringSvc.getStrings([
		'AvailabeSub.Text.OnlyShowQualifiedAndAvailableSubstitutes',
		'AvailableSub.Text.SearchForSubstitute',
		'AvailableSub.Text.LastName',
		'SearchSubstitute',
		'Days',
		'Hours',
		'Minutes',
		'ElapsedLeadTime'
	]);

	// Actions that can be bound to from the view
	var go = $scope.go = {

	};

	//Appending absence date with absencestarttime 
	var startTime = (absrStateVal.absr.absences[0].substituteStartTime != "" && absrStateVal.absr.absences[0].substituteStartTime != undefined) ? timeConvert(absrStateVal.absr.absences[0].substituteStartTime) : timeConvert(absrStateVal.absr.absences[0].absenceStartTime);
	var startDate = (absrStateVal.absr.startDate).split(' ')[0] + ' ' + startTime; 

	function timeConvert (time) {
		// Check correct time format and split into components
		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	  
		if (time.length > 1) { // If time format correct
		  time = time.slice (1);  // Remove full string match value
		  time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
		  time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join (''); // return adjusted time or original string
	  }

	//Absence Start datetime must be greater than or equal to current datetime 
	if((new Date()).getTime() <= (new Date(startDate)).getTime()){
		vm.showLeadTimeMsg = true;	
		var lTotLeadTime = (new Date(startDate)).getTime() - (new Date(absrStateVal.absr.created)).getTime();
		var lExpLeadTime = (new Date()).getTime() - (new Date(absrStateVal.absr.created)).getTime();

		vm.leadPercentage = Math.floor(lExpLeadTime * 100 / lTotLeadTime);
		
		//formatting time in days,hours and minutes format
		vm.enteredTime = formattedTime(lExpLeadTime);
		vm.leadTime = formattedTime(lTotLeadTime);

		//replacing placeholders of mnemonics with values
		vm.leadTimeMsg = strings['ElapsedLeadTime'].replace('{0}',vm.enteredTime).replace('{1}',vm.leadPercentage).replace('{2}',vm.leadTime);
	}

	function formattedTime(time){
		if (time == null) return "";
		//time is in milliseconds so converting time into minutes
		time = (time / (1000 * 60));

		var lMins = Math.floor(time % 60);
		var lHours = Math.floor(time / 60 % 24);
		var lDays = Math.floor(time / 24 / 60);
		
		return lDays + " " + strings['Days'] + ", " + lHours + " " + strings['Hours'] + ", " + lMins + " " + strings['Minutes'];
	}


}

// #-- END Component (cmpt-absr-available-substitutes-filter-panel) --# //
// #------------------------------------------------------------------# //
};});}());