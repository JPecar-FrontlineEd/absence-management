(function() {'use strict';angular.module('aesop')
.controller('SubstituteGeneralInfoCtrl', function ($stateParams, $scope, subDetailsVal, stringSvc, orgSvc, permissionSvc, substituteApi, toastHelp, reportHelp, iconHelp, stringHelp, parseAesopDateFilter, config) {
// #-----------------------------------------# //
// #------- SubstituteGeneralInfoCtrl -------# //

	// this is a route controller
	var route = this;
	var subId = $stateParams.subid;
	var orgSettings = orgSvc.getOrgData()[0].settings;

	route.strings = stringSvc.getStrings([
        'SubProfile.Title.SubstituteProfile',
        'SubProfile.label.SubProfileInformation',
        'SubProfile.label.Status',
        'SubProfile.Table.Header.SkillSet',
        'SubProfile.text.Active',
        'SubProfile.text.Inactive',
        'SubProfile.text.NotApplicable',
        'SubProfile.label.Phone',
        'SubProfile.label.Email',
        'SubProfile.label.ResumeOnFile',
        'SubProfile.text.NoSkills',
        'SubProfile.text.SkillNoExpiration',
        'SubProfile.text.NoResume',
        'SubProfile.text.SubRecordUnavailable'
    ]);

	// View Model properties
	route.vm = {
		subId: subId,
		substitute: null,
		//dataLoaded: false,
		//isLoading: false,
		subIsDeleted: false,
		subDeletedText: '',
		columns:[
            {
                key: 'description', width: '20/24',
                name: 'SubProfile.Table.Header.Skills',
                noTitle: true,
                sortable: true,
                defaultSort: 'asc',
                template:'{{row.description}}'
            }, {
                key: 'expirationDate', width: '4/24',
                name: 'SubProfile.Table.Header.SkillExpirationDate',
                noTitle: true,
                sortable: false,
                template:'<div ng-if="!row.doesExpire">'+route.strings['SubProfile.text.SkillNoExpiration']+'</div>' +
                			'<div ng-if="row.doesExpire" ng-class="{expired: row.isExpired}">{{row.expiresOnText}}</div>'
            }
        ],
        dataSet: [],
        canViewPhone: permissionSvc.iHave('SUB.ViewPhone'),
        showSubResume: orgSettings.showSubResume,
        showSubPhoto: orgSettings.showSubPhoto
	};

	processData(subDetailsVal);

	// loadSubstitute();

	// function loadSubstitute() {
	// 	route.vm.isLoading = true;

	// 	substituteApi.getById({id: subId})
	// 		.then(function(sub) {
	// 			processData(sub);
	// 			route.vm.dataLoaded = true;
	// 			route.vm.isLoading = false;
	// 		}, function (reason) {
	// 			toastHelp.error(reason.$messages, 'Error');
	// 			route.vm.dataLoaded = true;
	// 			route.vm.isLoading = false;
	// 		});
	// }

	function processData(sub){
		sub.fullName = sub.lastName + ', ' + sub.firstName;
		sub.hasResume = sub.resume != null;
		sub.hasPhoto = sub.photo != null;
		if (sub.resume != null) {
			sub.resume.icon = getResumeFileIcon(sub.resume.fileName);
			sub.resume.downloadLink = config.apiEndpoint + '/v1.0/Substitutes/'+sub.id+'/Resume?key='+sub.resume.downloadKey+'&fileId='+sub.resume.id;
		}
		if (sub.photo != null) {
			sub.photo.downloadLink = config.apiEndpoint + '/v1.0/Substitutes/'+sub.id+'/Photo?key='+sub.photo.downloadKey+'&fileId='+sub.photo.id;
		}

		route.vm.subIsDeleted = sub.isDeleted;
		route.vm.subDeletedText = stringHelp.replace(route.strings['SubProfile.text.SubRecordUnavailable'],'{0}', sub.fullName);

		route.vm.substitute = sub;
		route.vm.dataSet = sub.skills.map(function (s){
			s.description = s.skill.description;
			s.doesExpire = s.expiresOn.length > 0;
			s.isExpired = isExpired(s.expiresOn);
			s.expiresOnText = parseAesopDateFilter(s.expiresOn);
			return s;
		});
	}

	function isExpired(date) {
		if (date.length === 0) {
			return false;
		}
		var today = parseAesopDateFilter(new Date());
		//skills expiring today are not expired yet
		if (today === parseAesopDateFilter(date)) {
			return false;
		}
		if (reportHelp.IsBefore(date, today)) {
			return true;
		}
		return false;
	}

	function getResumeFileIcon(fileName){
		var ext = fileName.split('.').pop();
		return iconHelp.classForFileExt(ext);
	}

	// Actions that can be bound to from the view
	route.go = { };

// #----- END SubstituteGeneralInfoCtrl -----# //
});}());