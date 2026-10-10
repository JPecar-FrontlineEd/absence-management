(function() {'use strict';angular.module('aesop')
.controller('ReportWriterViewCtrl', function ($stateParams, $q, $scope, stringSvc, reportWriterApi, reportHelp, arrayHelp, permissionSvc, toastHelp, parseAesopDateFilter, dateHelp, parseDateFilter, timeFilter, urlHelp, ngDialog, $location, $timeout) {
// #------------------------------------# //
// #------- ReportWriterViewCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'Created',
        'by',
        'LastRun',
        'Actions',
        'RunWithNewFilters',
        'RunWithSavedFilters',
        'ReturnToReportTemplateList',
        'Details',
        'Reports.CriteriaPanel.Label.Type',
        'Reports.Title.ReportExecutions',
        'NoResultsFound',
        'ShowFixedTextFormat',
        'DisplayFields',
        'GroupByFields',
        'SortFields',
        'Entered',
        'Started',
        'Finished',
        'Output',
        'Edit',
        'Delete',
        'Finished',
        'Running',
        'LoadingDetails',
        'Report.Execute.Results.FailedtoRun',
        'Report.Execute.Results.Queued',
        'Report.Output.Label.DownloadResults',
        'Report.Output.Label.OutputRequested',
        'Report.Output.Label.DistributedToList',
        'Report.Output.Label.ResultsEmailedTo',
        'Report.Output.Label.NotificationEmailedTo',
        'Report.Output.Label.DeliveredBy',
        'Report.Output.Label.MarkAsExtracted',
        'Report.OutputType.WebPage',
        'Report.OutputType.CSV',
        'Report.OutputType.DelimitedText',
        'Report.OutputType.FixedText',
        'Report.Execute.Label.ReportRun',
        'Report.Output.FTP.Server',
        'Report.Output.FTP.Folder',
        'Report.Output.FTP.User',
        'Report.Output.FTP.Port',
        'absrList.button.viewDetails'
    ]);

    $scope.dgViewDetails = { strings: route.strings, dataLoaded: false };

    var urlParams = $location.search();

    // View Model properties
    route.vm = {
        isLoading: false,
        reportId: $stateParams.reportid,
	    reportConfig: {},
        fixedTextFormat: false,
        filters: {
            dateRange:{startDate: dateHelp.addDays(new Date(), -7), endDate: new Date()}
        },
        validation: { },
        columns:[
            {
                key: 'created', width: '8/24',
                sortable: false,
                name: 'Entered',
                noTitle: true,
                template: '{{ row.createdOn }}' +
                          '<div class="view-details">' +
                            '(<a href="#" ng-click="parentVm.showReportExecDetailsDialog(row)">' + route.strings['absrList.button.viewDetails'] + '</a>)' +
                          '</div>'
            },
            {
                key: 'processingStarted', width: '6/24',
                sortable: false,
                name: 'Started',
                template: '{{ row.startedOn }}'
            },
            {
                key: 'processingCompleted', width: '6/24',
                sortable: false,
                name: 'Finished',
                noTitle: true,
                template: '{{ row.completedOn }}'
            },
            {
                key: 'outputFiles', width: '4/24',
                sortable: false,
                name: 'Output',
                noTitle: true,
                template: '<cmpt-reports-report-writer-output-files report-exec="row"></cmpt-reports-report-writer-output-files>'
            }],
        reportExecs: [],
        showReportExecDetailsDialog: function(reportExec, isAuto) { viewReportExecDetails(reportExec, isAuto); },
        defaultReportExec: null,
        defaultRceId: angular.isDefined(urlParams.rce_id) ? urlParams.rce_id : '',
        execSearchCount: 0
    };

    function viewReportExecDetails(reportExec, isAuto) {
        if (isAuto) {
            $scope.dgViewDetails.isAuto = true;
        }
        var dialogOptions = {
                template:'/components/reports/cmpt-reports-report-writer-execdetails-dialog/reportsReportWriterExecdetailsDialog.html',
                closeByDocument: false,
                closeByNavigation: true,
                showClose: true,
                scope: $scope
            };
        var dialog = ngDialog.open(dialogOptions);

        //Added slight timeout due to loading status being shown before
        //  the dialog close animation complets all the way
        dialog.closePromise.then(function (data) {
            $timeout(function() {
                $scope.dgViewDetails.dataLoaded = false;
                $scope.dgViewDetails.data = null;
                if ($scope.dgViewDetails.isAuto) {
                    $location.search({});
                }
            }, 500);
        });

        var filter = reportHelp.convertReportWriterFilter({ reportExecId: reportExec.id });
        filter.fields = 'id,created,processingStarted,processingCompleted,complete,outputDeleted,' +
                        'downloadKey,outputHtml,outputCsv,outputDelimitedText,outputFixedText,' +
                        'distributionList,email,ftpType,ftpServer,ftpDirectory,ftpUser,ftpPort,' +
                        'markRecordsAsExtracted,numFailures,attachResults';
        reportWriterApi.reportExec(filter).then(function (data){
            $scope.dgViewDetails.data = processReportExecData(data);
            $scope.dgViewDetails.dataLoaded = true;
            }, function(reasons){
                toastHelp.error(reasons.$messages, 'Error');
            });
    }

    function processReportExecsData(data) {
        data.sort(arrayHelp.sort('created', true));
        var items = data.map(function(d) {
            d = processReportExecData(d);

            //Get report recently executed (returning from RW)
            if (route.vm.defaultRceId === (d.id + '')) {
                route.vm.defaultReportExec = d;
            }

            return d;
        });
        route.vm.reportExecs = items;
    }

    function processReportExecData(rce) {
        rce.createdOn = parseAesopDateFilter(rce.created, 'long');
        rce.startedOn = (rce.processingStarted !== null) ? parseAesopDateFilter(rce.processingStarted, 'long') : '';
        rce.completedOn = (rce.processingCompleted !== null) ? parseAesopDateFilter(rce.processingCompleted, 'long') : '';
        rce.downloadEnabled = rce.complete && !rce.outputDeleted;
        rce.outputHtmlDownload = urlHelp.getRwDownloadUrl(rce, '1');
        rce.outputCsvDownload = urlHelp.getRwDownloadUrl(rce, '2');
        rce.outputDelimitedTextDownload = urlHelp.getRwDownloadUrl(rce, '3');
        rce.outputFixedTextDownload = urlHelp.getRwDownloadUrl(rce, '4');
        return rce;
    }


    //Check conditions to automatically open the "View Details" dialog on load
    function autoShowDetailsDialog() {
        var ignoreDialog = angular.isDefined(urlParams.xph);
        return (!ignoreDialog && route.vm.defaultReportExec !== null && route.vm.execSearchCount === 0);
    }

    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            //Call api and load data
            toastHelp.clear();
            if(!route.vm.isLoading){
                var _defer = $q.defer();
                route.vm.isLoading = true;
                route.vm.filters.dateRange.startDate = parseDateFilter(route.vm.filters.dateRange.startDate, 'MM/dd/yyyy');
                route.vm.filters.dateRange.endDate = parseDateFilter(route.vm.filters.dateRange.endDate, 'MM/dd/yyyy');
                var filterOverride = { reportConfigId: $stateParams.reportId, showAllUsers: false };
                var filter = reportHelp.convertReportWriterFilter(route.vm.filters, filterOverride);
                filter.fields = 'id,created,processingStarted,processingCompleted,complete,outputDeleted,' +
                                'downloadKey,outputHtml,outputCsv,outputDelimitedText,outputFixedText';
                reportWriterApi.reportExecs(filter).then(function (data){
                    processReportExecsData(data);

                    //Show details for report recently run
                    if (autoShowDetailsDialog()) {
                        route.vm.showReportExecDetailsDialog(route.vm.defaultReportExec, true);
                    }

                    route.vm.execSearchCount += 1;

                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;
                    return _defer.resolve();
                },function(reasons){
                    route.vm.isLoading = false;
                    toastHelp.error(reasons.$messages, 'Error');
                    return _defer.resolve();
                });
                return _defer.promise;
            }
        }
    };

    function processReportData(rc) {
        rc.typeName = rc.type != null ? rc.type.description : '';
        rc.lastExecution = (rc.lastExecution !== null) ? parseAesopDateFilter(rc.lastExecution, 'short') : '';
        rc.created = parseAesopDateFilter(rc.created, 'short');
        rc.reportTypeOrder = rc.type.order;
        rc.createdBy = rc.owner != null ? rc.owner.name : '';
        var returnUrl = urlHelp.getReturnUrl('/abs-mgt/reports/report-writer/' + rc.id + '/view/');
        rc.runWithNewFiltersUrl = urlHelp.getRwExecuteReportUrl(rc, returnUrl, 2);
        rc.runWithSavedFiltersUrl = urlHelp.getRwExecuteReportUrl(rc, returnUrl, 1);
        rc.editReportUrl = urlHelp.getRwExecuteReportUrl(rc, returnUrl, 3);
        route.vm.reportConfig = rc;
    }

    function loadReport() {
        var filter = reportHelp.convertReportWriterFilter({ reportConfigId: $stateParams.reportId });
        var configFieldFields = 'name,field(friendlyFieldName),fieldLength,align,paddingCharacter,order,configFieldType,displayFieldType';
        filter.fields = 'name,id,lastExecution,created,owner,canEdit,canCreate,' +
                        'type(name,id,description),tokenKey,' +
                        'displayFields(' + configFieldFields + '),' +
                        'groupByFields(' + configFieldFields + '),' +
                        'sortFields(' + configFieldFields + ')';
        reportWriterApi.report(filter).then(function (data){
            processReportData(data);
        },function(reasons){
            toastHelp.error(reasons.$messages, 'Error');
        });
    }


    loadReport();




// #----- END ReportWriterViewCtrl -----# //
});}());
