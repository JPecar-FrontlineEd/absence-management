(function() {'use strict';angular.module('aesop')
.controller('SubAvailabilityCtrl', function ($q, $scope, stringSvc, substituteApi, reportHelp, dateHelp, stringHelp, arrayHelp, permissionSvc, toastHelp, featureSvc) {
// #-----------------------------------# //
// #------- SubAvailabilityCtrl -------# //

    // this is a route controller
    var route = this;

    // Get mnemonics that this view needs
    route.strings = stringSvc.getStrings([
        'NoRecordsFound',
        'Reports.Results.Label.InitialInstructions',
        'Reports.Title.SubAvailability',
        'Table.Header.Substitute',
        'AvailableSub.Text.Excluded',
        'SubPrefersLocation',
        'Table.Header.PhoneNumber',
        'Table.Header.Skills',
        'Reports.CriteriaPanel.Button.Print',
        'DR.Today',
        'daysago',
        'Day',
        'Days',
        'In',
        'SubProfile.text.Email'
    ]);

    // View Model properties
    route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
            date: new Date(),
            institution: null,
            institutions: [],
            substitutes: [],
            showSkills: false,
            skills: [],
            preferred: null,
            subExcluded: null,
            email: null
        },
        columns:[           
            {
                key: 'fullName', 
                width: '6/24',
                name: 'Table.Header.Substitute',
                sortable: false,
                template:'<cmpt-template-substitute-link substitute-id="{{ row.subId }}" substitute-name="{{ row.fullName }}"></cmpt-template-substitute-link>'
            },
            {
                key: 'excluded', 
                width: '2/24',
                name: 'AvailableSub.Text.Excluded',
                sortable: false,
                template: '<cmpt-template-boolean value="{{ row.excluded }}" show-only="yes"></cmpt-template-boolean>'
            },
            {
                key: 'preferred', 
                width: '3/24',
                name: 'SubPrefersLocation',
                sortable: false,
                headerTemplate: 'Prefers Location',
                template: '<cmpt-template-boolean value="{{ row.preferred }}" ng-class="{\'not-preferred\': !row.preferred}"></cmpt-template-boolean>'
            },
            {
                key: 'email', 
                width: '6/24',
                name: 'SubProfile.text.Email',
                sortable: false,
                template: '<div title="{{row.email}}">{{ row.email }}</div>'
            },
            {
                key: 'skills', 
                width: '7/24',
                name: 'Table.Header.Skills',
                noTitle:true,
                sortable: false,
                template: '<div ng-repeat="skill in row.skills" class="skill">' +
                           '<div ng-bind-html="skill"></div>' +
                        '</div>'
            }
        ],
        validation:{
             institution: function (){
                 if(route.vm.filters.institution===null){
                     return 'Please choose an institution.';
                 }else{
                    return '';
                 }
             }
        },
        dataSet: []
    };


    
    var canViewPhone = permissionSvc.iHave('Sub.ViewPhone');
    var subSendEmailFeatureEnabled = featureSvc.get('SubAvailabilitySendEmail').enabled;

    //Check to include phone# column if has permission to view sub phone #
    if (canViewPhone) {
        route.vm.columns[0].width = '5/24'; // fullName
        route.vm.columns[3].width = '5/24'; // perfered
        route.vm.columns.splice(3, 0, {
                key: 'phone', 
                width: '3/24',
                name: 'Table.Header.PhoneNumber',
                sortable: false,
                template: '{{ row.phone | phoneFormat }}'
        });
    }

    //Check to include checkbox column if feature is enabled
    if(subSendEmailFeatureEnabled){
        route.vm.columns.splice(0, 0, {
            key: 'masterCheckbox', width: '1/24',
            name: '<input type="checkbox" class="masterCheckbox" ng-click="go.masterCheckboxClick()">',
            sortable: false,
            template: '<input type="checkbox" class="checkbox">'
        });
    }

    //Adjust the width of skills column according to the visibility of phone and checkboxes
    if(canViewPhone && subSendEmailFeatureEnabled){
       route.vm.columns[6].width = '5/24';
    }else if(canViewPhone || subSendEmailFeatureEnabled){
       route.vm.columns[5].width = '6/24';
    }

    // Actions that can be bound to from the view
    route.go = {
        search: function () {
            toastHelp.clear();
            if(!route.vm.isLoading){

                var _defer = $q.defer();
                route.vm.isLoading = true;
                var filter = reportHelp.convertSubAvailabilityFilter(route.vm.filters);
                substituteApi.availability(filter).then(function (data){
                    route.vm.dataSet = data.map(function(d) {
                        return {
                            subId: d.subId,
                            fullName: d.fullName,
                            excluded: d.excluded,
                            preferred: d.preferred,
                            phone: d.phone,
                            email: d.email,
                            skills: d.skills.sort(arrayHelp.sort('name')).map(function (skill){
                                if(route.vm.filters.skills.indexOf(skill.id) > -1){
                                    return '<span class="active">'+ skill.name +'<span>' + getSkillExpiration(skill);
                                } else {
                                    return '<span>'+ skill.name +'</span>' + getSkillExpiration(skill);
                                }
                            })
                        };
                    });
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

    function getSkillExpiration(skill){
        if (skill.expires == null) {
            return '';
        } else {
            var days = Math.ceil(reportHelp.DayDiff(new Date(), new Date(skill.expires)));
            if (days > 0) {
                return '<span> (Expires on ' + skill.expires + ', ' + route.strings['In'].toLowerCase() + ' ' + Math.abs(days) + ' ' +
                            (Math.abs(days) > 1 ? route.strings['Days'].toLowerCase() : route.strings['Day'].toLowerCase()) + ')</span>';
            } else if (days === 0) {
                return '<span> (Expires on ' + skill.expires + ', ' + route.strings['DR.Today'] + ')</span>';
            } else {
                return '<span class="expired"> (Expired on ' + skill.expires + ', ' + Math.abs(days) + ' ' + route.strings['daysago'].toLowerCase() + ')</span>';
            }
        }
    }

// #----- END SubAvailabilityCtrl -----# //
});}());