(function() {'use strict';var app = angular.module('aesop');

	// #-------------------------------------# //
	// #---- Directive (ap-menu-toggler) ----# //
	app.directive('apMenuToggler', function ($timeout, $parse) {

		function findDropdownEl(elem, target) {
			var childUlArray = Array.prototype.slice.call(elem.find('ul'), 0);
			return angular.element(childUlArray.filter(function(v) {
				return angular.element(v).hasClass(target);
			})[0]);
		}

		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var targetClass = attrs.apMenuToggler || 'dropdown',
					actOn = (attrs.clickToggler === undefined) ? 'hover' : 'click',
					hideOnSelect = (attrs.noHideOnSelect === undefined || attrs.noHideOnSelect === 'false'),
					node = elem,
					dropdown = findDropdownEl(elem, targetClass),
					lock = false,
					timer;

				if (actOn === 'hover') {
					elem.on('mouseenter', function () { toggle(true); });
					elem.on('mouseleave', function () { toggle(false); });
				} else {
					elem.on('click', function (e) {
						lock = true;
						toggle(!dropdown.hasClass('active'));
					});

					// Need to specifically include the datepicker trigger class.
					//  Was not registering as part of document.body and would not
					//  close when clicking on datepicker icon.
					angular.element("body, .ui-datepicker-trigger").on('click', function (e) {
						if (!lock) { toggle(false); }
						lock = false;
					});
				}

				addDdClick();

				function toggle(state) {
					if (!dropdown.length) { dropdown = findDropdownEl(elem, targetClass); addDdClick(); }
					if (timer) { $timeout.cancel(timer); }
					if (state && !dropdown.hasClass('active')) {
						dropdown.css('z-index', 5);
						dropdown.addClass('active');
						node.addClass('active-state');
						if (attrs.onMenuOpen) { $parse(attrs.onMenuOpen)(scope); }
					} else if (!state && dropdown.hasClass('active')) {
						if (actOn === 'hover') {
							dropdown.css('z-index', 4);
							timer = $timeout(function () {
								dropdown.removeClass('active');
								node.removeClass('active-state');
								if (attrs.onMenuClose) { $parse(attrs.onMenuClose)(scope); }
							}, 200);
						} else {
							dropdown.removeClass('active');
							node.removeClass('active-state');
							if (attrs.onMenuClose) {
								$parse(attrs.onMenuClose)(scope); }
						}
					}
				}

				function addDdClick() {
					if (dropdown) {
						dropdown.on('click', function (e) {
							e.stopPropagation();

							//Using jQuery to see if the clicked menu item is set to override the hide on select functionality.
							//We decided that this is the way to go for now, until we rewrite this directive to handle
							//this situation using pure angular.
							//NOTE: this will break if we move the menu structure away from a ul -> li layout similar to findDropdownEl() above.
							var menuItemSetToOverrideHideOnSelect = false;
							try {
								var clickedMenu = $(e.target).closest('li');
								if (clickedMenu != null) {
									var attr = $(clickedMenu).attr('no-hide-on-select');
									menuItemSetToOverrideHideOnSelect = (typeof attr !== typeof undefined && attr !== false);
								}
							} catch(err) {} //in the event of some unforeseen error, gracefully degrade and ignore the override. hide anyway.

							if (hideOnSelect && !menuItemSetToOverrideHideOnSelect) {
								toggle(false);
							}
						});
					}
				}

				scope.$root.$on('close-menu', function (e) {
					e.stopPropagation();
					toggle(false);
				});
			}
		};

	});
	// #-- END Directive (ap-menu-toggler) --# //
	// #-------------------------------------# //

}());