(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------# //
	// #----- Helper (stringHelp) -----# //
	app.factory('stringHelp', function (regexHelp) {

		function repeat(chr, count) {
			var str = '';
			for (var x = 0; x < count; x++) {
				str += chr;
			}
			return str;
		}

		return {

			formatPhone: function(phone){
				if(phone == null) { return ''; }
				phone = phone.replace(/[^0-9]/g, '');
				phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
				return phone;
			},
			replace: function(text, find, replace) {
				return text.replace(find, replace);
			},

			replaceAll: function (text, find, replace) {
				return text.replace(new RegExp(regexHelp.escapeString(find), 'g'), replace);
			},

			padL: function(input, width, pad) {
				var length;

				if (!width || width < 1) { return input; }
				if (!pad) { pad = ' '; }

				length = width - input.length;
				if (length < 1) { return input.substr(0, width); }

				return (repeat(pad, length) + input).substr(0, width);
			},

			padR: function(input, width, pad) {
				var length;

				if (!width || width < 1) { return input; }
				if (!pad) { pad = ' '; }

				length = width - input.length;
				if (length < 1) { input.substr(0, width); }

				return (input + repeat(pad, length)).substr(0, width);
			},

			toTitleCase: function(string) {
				return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			},

			isValidEmail: function(string) {
				var rexEmail = /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/;
				return rexEmail.test(string);
			},

			highlightText: function(stringToHighlight, stringToCheck)
			{
				//return stringToCheck;
				if (!stringToHighlight) return stringToCheck;
				if (!stringToCheck) return stringToCheck;

				var search = stringToHighlight.toLowerCase();
				var index = stringToCheck.toLowerCase().indexOf(search);
				if (index < 0) return stringToCheck;

				return stringToCheck.substr(0, index) +
					"<b>" + stringToCheck.substr(index, search.length) + "</b>" +
					stringToCheck.substr(index + search.length, 999);
			}

		};

	});
	// #--- END Helper (stringHelp) ---# //
	// #-------------------------------# //

}());