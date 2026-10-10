
(function() {'use strict';var app = angular.module('aesop');

app.directive('ngContextMenu',  function(contextMenuSvc, $rootScope, permissionSvc,config) {
		return {
		  restrict: 'A',
		  scope: '@&',
		  compile: function compile(tElement, tAttrs, transclude) {
			return {
			  post: function postLink(scope, iElement, iAttrs, controller) {
				var ul = $('#contextMenu'), last = null, scrollingElement;

				$(window).scroll(function(){
					if ((scrollingElement != undefined) && $(scrollingElement).offset().top != 0) {
						$(ul).offset({top: $(scrollingElement).offset().top});
						if ($(scrollingElement).offset().top - $(window).scrollTop() < 0){
							ul.css({ 'display': 'none' });
						}
					}
				});

				scope.isVeritimeWorkDetailReportAllowed = false;
				scope.allContextMenuItems = null;

				scope.isVeritimeWorkDetailReportAllowed = permissionSvc.ready.then(function (){
					if(permissionSvc.iHave('VTOPTIONS.VIEW_WORK_DET')){
						return true;
					}
				});

				scope.allContextMenuItems = contextMenuSvc.ready.then(function (contextMenuItems) {
					 return contextMenuItems;
				});

				$(iElement).bind('contextmenu', function(event) {
				  event.preventDefault();
				  scrollingElement = event.target;

					var isConfirmationNumber = event.target.href.includes('detail/');
					var id = isConfirmationNumber ? event.target.href.split('detail/')[1].split('/')[0] : event.target.href.split('_id=')[1];
					var absrOrId = isConfirmationNumber? 'absr=' : '_id=';
					var workerOrSubstituteIndicator = (iAttrs.ngContextMenu == 'Worker') ? 2: 3;
					if (iAttrs.ngContextMenu == 'Worker' && event.target.href.includes('vp_general')){
						iAttrs.ngContextMenu = 'VacancyProfile';
					}

					// filtering data based of group
					var contextMenuItems = scope.allContextMenuItems.$$state.value.filter(function(contextMenuItem) { return contextMenuItem.group == iAttrs.ngContextMenu });

					// checking and filtering veritime work detail option
					if ((iAttrs.ngContextMenu == 'Worker' || iAttrs.ngContextMenu == 'Substitute') && !scope.isVeritimeWorkDetailReportAllowed.$$state.value){
						contextMenuItems = contextMenuItems.filter(function(contextMenuItem) { return !contextMenuItem.URL.includes('RedirectToVeriTime') });
					}

					// creating base domain for veritime work detail option
					var baseDomain = '//' + config.platformSubDomain + config.topLevelDomain;
					for (var i = 0; i < contextMenuItems.length; i++){
						if (contextMenuItems[i].URL.split('absr=').length > 1 || contextMenuItems[i].URL.split('_id=').length > 1){
							contextMenuItems[i].URL = contextMenuItems[i].URL.split(absrOrId)[0] + absrOrId + id;		// if context menu has been opened for the first time.
						} else {
							if (contextMenuItems[i].URL.includes('RedirectToVeriTime')){
								contextMenuItems[i].URL = contextMenuItems[i].URL.includes('DurationFormat') ? contextMenuItems[i].URL : contextMenuItems[i].URL +
															encodeURIComponent('?UserType=' + workerOrSubstituteIndicator + '&UserKey=UNIQUEKEY&DurationFormat=TIME&SUB_ID=');
								contextMenuItems[i].URL = contextMenuItems[i].URL.replace('UNIQUEKEY',id);
								contextMenuItems[i].URL = contextMenuItems[i].URL.includes(baseDomain) ? contextMenuItems[i].URL : baseDomain + contextMenuItems[i].URL;
							}
							contextMenuItems[i].URL = contextMenuItems[i].URL + id;
						}
					}

					$rootScope.$emit("contextMenuDataChanged", contextMenuItems, event.target.text);

					ul.css({
						position: "fixed",
						display: "block",
						left: event.clientX + 'px',
						top: event.clientY + 'px'
					});

					if (($(document).height() - $(event.target).offset().top) - ul.height() < 0) {
						var ulTop = event.clientY - ul.height();
						ul.css({ top: ulTop + 'px'});
					}

					last = event.timeStamp;
				});


				$(document).click(function(event) {
				  var target = $(event.target);
				  if (!target.is(".popover") && !target.parents().is(".popover")) {
					if (last === event.timeStamp)
					  return;
					ul.css({ 'display': 'none' });
				  }
				});
			  }
			};
		  }
        };

      });

	}());
