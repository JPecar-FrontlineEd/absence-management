(function() {'use strict';angular.module('aesop')
.controller('ExcludedSubsCtrl', function ($q, $scope, stringSvc, substituteApi, reportHelp, dateHelp, stringHelp, arrayHelp, permissionSvc, toastHelp) {
// #--------------------------------# //
// #------- ExcludedSubsCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'NoRecordsFound',
        'Reports.Results.Label.InitialInstructions',
        'Reports.Title.ExcludedSubstitutes',
        'Report.ExcludedSub.Text.PreferenceListOwner',
        'Report,ExcludedSub.Text.ExcludedSubstitutes',
        'Report.Excluded.Text.ExcludedFrom',
        'Comments',
        'School',
        'Employee',
        'Substitute',
        'Reports.Filter.ViewBy.PreferenceList',
        'Reports.CriteriaPanel.Button.Print'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            institutions: [],
            employeeExclusion: false,
            viewBy: 'prefList',
            viewByOptions: [ {value:'prefList', title:'Preference List', display:'Reports.Filter.ViewBy.PreferenceList'},
                             {value:'sub', title:'Substitute', display:'Substitute'}],
            fields: '(commentsExcluded,substitute(id,firstName,middleName,lastName),institution(id,name),worker(id,firstName,middleName,lastName))'
        },
        dataSet: [],
        distinctSubIds: [],
        itemSort: 'subName',

    };

    //Setup alternate columnsets for each view type
    var viewByColumns = {
        prefList: [
            {
                key: 'PrefListOwner', width: '11/24',
                name: 'Report.ExcludedSub.Text.PreferenceListOwner',
                template: ' '
            },
            {
                key: 'ExcludedSubs', width: '13/24',
                name: 'Report,ExcludedSub.Text.ExcludedSubstitutes',
                template: '<cmpt-template-substitute-link substitute-id="{{ row.subId }}" substitute-name="{{ row.subName }}"></cmpt-template-substitute-link>'
            }],
        sub: [
            {
                key: 'ExcludedSubs', width: '11/24',
                name: 'Report,ExcludedSub.Text.ExcludedSubstitutes',
                template: ' '
            },
            {
                key: 'ExcludedFrom', width: '13/24',
                name: 'Report.Excluded.Text.ExcludedFrom',
                template: '{{ row.prefListOwner }}'
            }]
    };
    route.vm.columns = viewByColumns.prefList;


    //Check to include comments if has permission to view pref list comments
    var canViewComments = permissionSvc.iHave('PREFLIST.COMMENTVIEW');
    if (canViewComments) {
        var commCol = {
            key: 'commentsExcluded', width: '8/24',
            name: 'Comments'
        };

        viewByColumns.prefList[0].width = '8/24';
        viewByColumns.prefList[1].width = '8/24';
        viewByColumns.prefList.push(commCol);

        //When viewing by sub, we are not showing any comments info
        //but we still leave the column present in the list
        var blankCommCol = {
            key: '', width: '8/24',
            name: ''
        };
        viewByColumns.sub[0].width = '8/24';
        viewByColumns.sub[1].width = '8/24';
        viewByColumns.sub.push(blankCommCol);
    }


    function processData(data) {
        return data.map(function(d) {

            d.workId = '';
            d.workName = '';
            d.instId = '';
            d.instName = '';
            d.prefListOwner = '';
            d.prefListOwnerSort = '';
            d.groupSort = '';
            d.itemSort = '';
            d.subId = d.substitute.id;
            d.subName = d.substitute.lastName + ', ' + d.substitute.firstName+' '+d.substitute.middleName;

            //Is excluded on institution or worker pref list?
            if (d.institution !== null) {
                d.instId = d.institution.id;
                d.instName = d.institution.name;
                d.prefListOwner = route.strings['School'] + ': ' + d.instName;
                d.prefListOwnerSort = '1-' + d.prefListOwner;
            }
            else {
                d.workId = d.worker.id;
                d.workName = d.worker.lastName + ', ' + d.worker.firstName;
                d.prefListOwner = route.strings['Employee'] + ': ' + d.workName;
                d.prefListOwnerSort = '2-' + d.prefListOwner;
            }

            //Alter grouping/sorting based on "View By" option
            if (route.vm.filters.viewBy === 'sub') {
                d.groupSort = d.subName;
                d.groupTitle = '<cmpt-template-substitute-link substitute-id="{{ group.items[0].subId }}" substitute-name="{{ group.items[0].subName }}"></cmpt-template-substitute-link>';
            } else {
                d.groupSort = d.prefListOwnerSort;
                d.groupTitle = d.prefListOwner;
            }

            return d;
        });
    }

    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            if(!route.vm.isLoading){
                toastHelp.clear();
                var _defer = $q.defer();
                route.vm.isLoading = true;
                var filter = reportHelp.convertExcludedSubsFilter(route.vm.filters);
                substituteApi.excluded(filter).then(function (data) {

                    //Switch columnset based on "View By" option
                    if (route.vm.filters.viewBy === 'sub') {
                        route.vm.columns = viewByColumns.sub;
                        route.vm.itemSort = 'prefListOwnerSort';
                    } else {
                        route.vm.columns = viewByColumns.prefList;
                        route.vm.itemSort = 'subName';
                    }

                    route.vm.dataSet = processData(data).sort(arrayHelp.multiLevelSort(['groupSort', route.vm.itemSort]));
                    route.vm.isLoading = false;
                    route.vm.dataLoaded = true;

                    //Get distinct subs to use for result count
                    var subIds = [];
                    data.forEach(function(v, i, a) {
                        if (subIds.indexOf(v.substitute.id) === -1) {
                            subIds.push(v.substitute.id);
                        }
                    });
                    route.vm.distinctSubIds = subIds;
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

// #----- END ExcludedSubsCtrl -----# //
});}());