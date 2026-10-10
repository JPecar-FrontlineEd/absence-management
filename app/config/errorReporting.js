(function () {
	'use strict';
	var app = angular.module('aesop');

	// Angular's default $exceptionHandler/$q unhandled-rejection logging serializes
	// the error via JSON.stringify, which prints "{}" for real Error objects because
	// message/stack are non-enumerable. This surfaces the actual content instead.
	function serializeError(err) {
		if (err instanceof Error) {
			var extra = {};
			Object.keys(err).forEach(function (key) {
				extra[key] = err[key];
			});

			return {
				message: err.message,
				stack: err.stack,
				extra: extra
			};
		}

		return err;
	}

	app.config(function ($provide) {
		$provide.decorator('$exceptionHandler', function ($delegate) {
			return function (exception, cause) {
				console.error('Unhandled exception/rejection:', serializeError(exception), cause);
				$delegate(exception, cause);
			};
		});
	});

	app.value('serializeError', serializeError);
}());
