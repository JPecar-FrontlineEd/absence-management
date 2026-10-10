(function() {'use strict';angular.module('aesop')
.controller('SchoolSharedFilesCtrl', function ($q,permissionSvc, schoolDetailsVal, stringSvc, institutionApi, iconHelp, filesApi, toastHelp,config) {
// #-------------------------------------# //
// #------- SchoolSharedFilesCtrl -------# //

    // this is a route controller
    var route = this;
    var canUpload = permissionSvc.iHave('UPLOAD.ABSR');
    route.strings = stringSvc.getStrings([
        'Loading',
        'AbsenceFiles',
        'NumberOfFiles',
        'Filesmustbein',
        'andlessthan',
        'UploadFile',
        'Absence.Files.Instruction.NoFiles',
        'File',
        'Description',
        'ActiveFrom',
        'ActiveTo',
        'Actions',
        'SaveChanges'
    ]);



    // View Model properties
    route.vm = {
        isLoading: true,
        dataLoaded:false,
        isProcessing: false,
        schoolName: schoolDetailsVal.name,
        data: [],
        cols:[{
            key: 'file', width: '9/24',
            name: 'File',
            sortable: false,
            template: '<a target="_self" class="file fa {{ row.icon }}-before" ng-if="row.id > 0" title="{{ row.fileName }}" href="{{ actions.downloadLink(row)}}">{{ row.fileName }}</a>' +
                        '<div title="{{ row.fileName }}" class="file fa {{ row.icon }}-before" ng-if="row.id === 0">{{ row.fileName }}</div>'
        },{
            key: 'description', width: '7/24',
            name: 'Description',
            sortable: false,
            template: '<cmpt-ui-textbox value-text="row.description"></cmpt-ui-textbox>'
        },
        {
            key: 'activeFrom', width: '4/24',
            name: 'ActiveFrom',
            sortable: false,
            template: '<cmpt-ui-date-selector class="date-picker no-bg-color" date-model="row.activeFrom"></cmpt-ui-date-selector>'
        },
        {
            key: 'activeTo', width: '4/24',
            name: 'ActiveTo',
            sortable: false,
            template: '<cmpt-ui-date-selector class="date-picker no-bg-color" date-model="row.activeTo"></cmpt-ui-date-selector>'
        }]
    };

    if(canUpload){
        route.vm.cols.splice(route.vm.cols.length, 1, {
            key: 'Actions', width: '2/24',
            name: 'Actions',
            sortable: false,
            template: '<button class="fl-button" ng-click="actions.deleteFile($index)"><i class="fa" ng-class="{\'fa-trash-o\': !row.isProcessing, \'fa-spinner fa-spin\': row.isProcessing}"></i></button>'
        });
        route.vm.cols[0].width = '7/24';
    }



    fetchResults();

    // Actions that can be bound to from the view
    route.go = {
        deleteFile: function (index) {
            var file = route.vm.data[index];
            if(!file.isProcessing){
                if (file.id === 0) {
                    route.vm.data.splice(index, 1);
                } else {
                    file.isProcessing = true;
                    filesApi.remove({id: file.id}).then(
                        function () {
                            file.isProcessing = false;
                            route.vm.data = route.vm.data.filter(function (f) {
                                return f.id !== file.id;
                            });
                        },
                        function (errors) {
                            file.isProcessing = false;
                            toastHelp.error(errors.$messages, 'Error');
                        }
                    );
                }
            }
        },
        downloadLink: function (file){
            return config.apiEndpoint + '/v1.0/Files/' + file.id + '/Download?key=' + window.escape(file.downloadKey);
        },
        save: function (){
            if(!route.vm.isProcessing){
                route.vm.isProcessing = true;
                var saveFiles = institutionApi.files.save({instId: schoolDetailsVal.id },route.vm.data);
                saveFiles.then(function(){
                    route.vm.dataLoaded = false;
                    fetchResults().then(function (){
                        route.vm.isProcessing = false;
                    });
                }, function (errors) {
                    route.vm.isProcessing = false;
                    toastHelp.error(errors.$messages, 'Error');
                });
            }
        }
    };


    function fetchResults () {
        var _defer = $q.defer();
        route.vm.isLoading = true;
        route.vm.data.length = 0;
        institutionApi.files.get({ instId: schoolDetailsVal.id }).then(function (data){
            route.vm.isLoading = false;
            processResult(data);
            return _defer.resolve();
        }, function (errors){
            toastHelp.error(errors.$messages, 'Error');
            return _defer.reject();
        });
        return _defer.promise;
    }
    function processResult (data) {
        route.vm.data = data.map(function (v) {
            v.icon = iconHelp.classForFileExt(v.fileExtension);
            v.isProcessing = false;
            return v;
        });
        route.vm.dataLoaded = true;

}


// #----- END SchoolSharedFilesCtrl -----# //
});}());