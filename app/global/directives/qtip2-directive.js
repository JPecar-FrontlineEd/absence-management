(function($) {'use strict'; var app = angular.module('aesop');

app.directive('qtip', function (stringSvc, domHelp, $compile) {
	return  {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var my = attrs.my || 'top center',
				at = attrs.at || 'bottom center',
				on = attrs.on || 'mouseover focus',
				mnemonic = attrs.mnemonic || null,
				hideEvent = 'mouseleave blur',
				qtipClass = attrs.qtipClass || attrs.class || 'qtip',
				content, strings;

			scope.$qtip = {
				visible: false
			};

			if (mnemonic !== null) {
				strings = stringSvc.getStrings([mnemonic]);
			} else if (attrs.title) {
				content = {'title': attrs.title, 'text': attrs.content};
			} else {
				content = $compile(attrs.content)(scope);
			}

			if (on === 'click') {
				hideEvent = 'unfocus';
			}

			if (strings != null) {
				content = strings[mnemonic];
				render();
			}

			render();

			function render () {
				$(element).qtip({
					content: content,
					position: {
						my: my,
						at: at,
						target: element,
						viewport: $(window)
					},
					show: {
						event: on
					},
					hide: {
						event: hideEvent,
						fixed : true,
						delay : 100
					},
					events: {
						show: function (e, api) {
							scope.$qtip.visible = true;
						},
						hide: function (e, api) {
							scope.$qtip.visible = false;
						}
					},
					style: {classes:qtipClass,tip:{height: 10, width: 20}}
				});
			}

			scope.$watch('$qtip.visible', function (visible) {
				$(element).qtip('toggle', visible);
			});

			//allow the Qtip to dynamically refresh if the content changes.
			attrs.$observe('content', function(newVal) {
				var content = $compile(attrs.content)(scope);
				$(element).qtip('option', 'content.text', content);
			});
		}
	};
});

})(window.jQuery);
