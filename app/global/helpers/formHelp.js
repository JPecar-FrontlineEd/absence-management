(function() {'use strict';var app = angular.module('aesop');

	// #-----------------------------# //
	// #----- Helper (formHelp) -----# //
	app.factory('formHelp', function (config) {

		function download(url,data) {
			var form = document.createElement("form");
		 	var node = document.createElement("input");
		 	form.action = url;
		 	form.method = "POST";
			form.target = "_blank";
		 	for(name in data) {
		 		 node.name  = name;
				 node.value = data[name] !== null ? data[name].toString() : "";
		 		 form.appendChild(node.cloneNode());
		 	}
		 	form.style.display = "none";
		 	document.body.appendChild(form);
   	  	    form.submit();

		 	// But once the form is sent, it's useless to keep it.
		 	document.body.removeChild(form);
		}




		return {
			setTouched: function (form) {
					angular.forEach(form.$error, function (field) {
					 angular.forEach(field, function(errorField){
								 errorField.$setTouched();
						 });
				 });
			},
			download
		};

	});
	// #--- END Helper (formHelp) ---# //
	// #-----------------------------# //

}());
