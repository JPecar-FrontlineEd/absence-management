(function() {'use strict';angular.module('aesop')
.directive('cmptReportsReportWriterOutputFiles', function () {return {

// directive options
restrict: 'E',
scope: {
	reportExec: '=',  // ApiRwReportExecution
	showText: '='     // bool - show larger icon with text underneath (for details dialog)
},
replace: true,
templateUrl: '/components/reports/cmpt-reports-report-writer-output-files/reportsReportWriterOutputFiles.html',

// #-------------------------------------------------------------# //
// #---- Component (cmpt-reports-report-writer-output-files) ----# //
controller: function ($scope, stringSvc, urlHelp) {

	// View Model properties
	var vm = $scope.vm = {
		fileIcons: [],
		showText: (angular.isDefined($scope.showText)) ? $scope.showText : false
	};

	$scope.reportExec = (angular.isDefined($scope.reportExec)) ? $scope.reportExec : null;

	if ($scope.reportExec === null)
	{
		return;
	}

    vm.strings = stringSvc.getStrings([
        'Report.OutputType.WebPage',
        'Report.OutputType.CSV',
        'Report.OutputType.DelimitedText',
        'Report.OutputType.FixedText'
    ]);


    var fileTypeConfigs = {
    	'html': { cssClass: 'html', text: vm.strings['Report.OutputType.WebPage'], type: '1', target: '_blank' },
    	'csv': { cssClass: 'file fa fa-file-excel-o', text: vm.strings['Report.OutputType.CSV'], type: '2' },
    	'delimited': { cssClass: 'file fa fa-file-delim-o', text: vm.strings['Report.OutputType.DelimitedText'], type: '3' },
    	'fixed': { cssClass: 'file fa fa-file-text-o', text: vm.strings['Report.OutputType.FixedText'], type: '4' }
    };


    //Replace spaces with html <br/> (for dialog display)
    function getTextWithLineBreak(text) {
    	text = text.replace(/(.+) (.+)/, '$1<br/>$2');
    	return text;
    }


    //Adds output file icon to results
    function addFileIcon(fileType) {
    	var config = fileTypeConfigs[fileType];
		vm.fileIcons.push({
			enabled: $scope.reportExec.complete && !$scope.reportExec.outputDeleted,
			cssClass: config.cssClass,
			text: getTextWithLineBreak(config.text),
			title: config.text,
			linkUrl: urlHelp.getRwDownloadUrl($scope.reportExec, config.type),
			linkTarget: angular.isDefined(config.target) ? config.target : '_self'
		});
    }


    //Determine which output file icons to include
	if ($scope.reportExec.outputHtml) {
		addFileIcon('html');
	}
	if ($scope.reportExec.outputCsv) {
		addFileIcon('csv');
	}
	if ($scope.reportExec.outputDelimitedText) {
		addFileIcon('delimited');
	}
	if ($scope.reportExec.outputFixedText) {
		addFileIcon('fixed');
	}

}

// #-- END Component (cmpt-reports-report-writer-output-files) --# //
// #-------------------------------------------------------------# //
};});}());