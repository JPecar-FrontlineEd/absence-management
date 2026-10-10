(function() {'use strict';angular.module('aesop')
.controller('SchoolTimeSettingsCtrl', function (orgSvc, stringSvc, schoolDetailsVal) {
// #--------------------------------------# //
// #------- SchoolTimeSettingsCtrl -------# //

    // this is a route controller
    var route = this;
    var orgData = orgSvc.getOrgData();
    var subReportTimesEnabled = orgData[0].settings.subReportTimesEnabled;

    route.strings = stringSvc.getStrings([
        'SchoolSettings.text.SchoolSettings',
        'SchoolSettings.text.Active',
        'SchoolSettings.text.TimeZone',
        'SchoolSettings.text.AbsenceTimes',
        'SchoolSettings.text.StartTime',
        'SchoolSettings.text.HalfDayAMEndTime',
        'SchoolSettings.text.HalfDayPMStartTime',
        'SchoolSettings.text.EndTime',
        'SchoolSettings.text.SubstituteReportTimes',
        'SchoolSettings.text.SubstituteRelativeStartEnd',
        'SchoolSettings.text.RelativeStart',
        'SchoolSettings.text.minsAfter',
        'SchoolSettings.text.minsBefore',
        'SchoolSettings.text.RelativeEnd'
    ]);

    // View Model properties
    route.vm = {
        institution: schoolDetailsVal,
        subReportTimesEnabled: subReportTimesEnabled,
        subRelativeStartAbs: Math.abs(schoolDetailsVal.subRelativeStartTimeMinutes),
        subRelativeEndAbs: Math.abs(schoolDetailsVal.subRelativeEndTimeMins)
    };

    // Actions that can be bound to from the view
    route.go = {
        someAction: function () {
            route.vm.property = 'something';
        }
    };

// #----- END SchoolTimeSettingsCtrl -----# //
});}());