(function() {'use strict';angular.module('aesop')
.directive('cmptUiFileUpload', function () {return {

// directive options
restrict: 'E',
scope: {
	files:'=',
	enabled:'='
},
replace: true,
transclude: true,
templateUrl: '/components/ui/cmpt-ui-file-upload/uiFileUpload.html',

// #-----------------------------------------# //
// #---- Component (cmpt-ui-file-upload) ----# //
controller: function ($scope, $upload, stringSvc, tokenSvc, iconHelp, config) {

	$scope.strings = stringSvc.getStrings(['SelectFile']);

	var allowedMimeTypes = [
		'application/pdf',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-powerpoint',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation'
	];
	var mimeTypes = allowedMimeTypes.join(',');
	var sizeInMb = 2;

	// View Model properties
	var vm = $scope.vm = {
		progress: 0,
		errorMessage:[],
		files: [],
		mimeTypes: mimeTypes
	};

	$scope.$watch('vm.files', function(files){
		var token = tokenSvc.get(), file, i;
		vm.errorMessage.length = 0;
		for (i = 0; i < files.length; i++) {
			file = files[i];
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);
			var j = 0; var firstTwoBytes = '';
			
			reader.onload = (evt) => {
				const arrayBuffer = evt.target.result,
				array = new Uint8Array(arrayBuffer);
				for (const a of array) {
					// reading only two byte to check the executable file
					firstTwoBytes = firstTwoBytes + String.fromCharCode(a); 
					if (j++ == 1) {
						if(firstTwoBytes == 'MZ' || firstTwoBytes == 'ZM') {
							vm.errorMessage.push(file.name + ' is an invalid file');
							return false;
						}
					}
				}
			}
			if(!isMimeTypeAllowed(file.type)){
				vm.errorMessage.push(file.name + ' File type not allowed');
				continue;
			}
			if(!isFileSizeAllowed(file.size)){
				vm.errorMessage.push(file.name + ' File is too large. Max size: ' + sizeInMb + ' MB');
				continue;
			}
			$upload.upload({
				url: config.apiEndpoint + '/v1.0/Upload',
				headers: {'AesopToken': token},
				file: file, // or list of files ($files) for html5 only
			})
			.progress(uploadProgress)
			.success(uploadSuccessful);
		}
	});

	function uploadProgress(evt) {
		vm.progress = parseInt(100.0 * evt.loaded / evt.total);
	}

	function uploadSuccessful(res, status, headers, config) {
		//StatusCode - 412 Indicates that a condition set for this request failed, and the request cannot be carried out
		if (status == 412) {
			res.messages.map(function (v) {
				vm.errorMessage.push(v);
			});
			vm.progress = 0;
			return;
		}

		$scope.files = $scope.files.concat(res.data.map(function (v) {
			v.icon = iconHelp.classForFileExt(v.fileExtension);
			return v;
		}));
		vm.progress = 0;
	}

	function isMimeTypeAllowed (mimeType) {
		return allowedMimeTypes.indexOf(mimeType) > -1;
	}

	function isFileSizeAllowed(size){
		return size <= sizeInMb * (1048576);
	}
}

// #-- END Component (cmpt-ui-file-upload) --# //
// #-----------------------------------------# //
};});}());