(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------------# //
	// #----- Helper (navigatorProxyHelp) -----# //
	app.factory('navigatorProxyHelp', function (permissionSvc) {

		return {
			modifyNavigatorMarkup: function (cDoc, cWin, docEl, fBody) {
				var titleKeepList = [
						'CREATE ABSENCE',
						'CREATE VACANCY',
						'ABSENCE MODIFY',
						'DAILY REPORT',
						'LIVE HELP',
						'SCHOOL',
						'FIND EMPLOYEE',
						'CLASSIC HOME PAGE',
						'DASHBOARD'
					],
					menuEl = cDoc.getElementById('topMenu'),
					menuParent, brNode, backNode, linkNode, linkText,
					quickLinkCells, i, el;

				//Only keep the Find Sub button if this Org has Aesop and VeriTime
				if (!permissionSvc.iHave('PSEUDO.IsVeritimeOnly')) {
					titleKeepList.push('FIND SUBSTITUTE');
				}

				// remove black main menu
				try {
					menuParent = menuEl.parentElement;
					menuParent.removeChild(menuEl);
					menuParent.removeChild(cDoc.getElementById('topMenuSpacer'));
				} catch(err) {}

				// remove quick links that we don't need
				try {
					quickLinkCells = cDoc.querySelector('td[title="CREATE ABSENCE"]')
						.parentNode.getElementsByTagName('td');

					i = quickLinkCells.length;
					for (; i-- ;) {
						el = quickLinkCells[i];
						if (!el.title || titleKeepList.indexOf(el.title) === -1) {
							el.parentElement.removeChild(el);
						}
					}
				} catch(err) {}

				// remove user voice button
				// try {
				// 	el = cDoc.getElementById('uvTab');
				// 	el.parentElement.removeChild(el);
				// } catch(err) {}

				//change links in navigator
				var els = cDoc.getElementsByTagName('a'),
				elsLength = els.length;
				for (var c = 0, l = elsLength; c < l; c++) {
					var aEl = els[c];
					//change target path of login as org user link from navigator
					if (aEl.href.search(/navigator\/login\.asp/i) !==  -1) {
						aEl.target = '_top';
					} else if (aEl.href.search(/gotomeeting.com/i) !==  -1) {
						aEl.target = '_blank';
					}

					//legacy abs interactive export link should open in target=blank
					if (aEl.href.search(/export\=XV/i) !==  -1) {
						aEl.target = '_blank';
					}

					//legacy extract_data text file and zip file download
					if (aEl.href.search(/\/extract\/.*?\.txt$/i) !==  -1 || aEl.href.search(/\/extract\/.*?\.zip$/i) !==  -1) {
						aEl.target = '_blank';
					}

					//legacy general data import guide
					if(aEl.href.search(/DataImports\.pdf/i) !==  -1){
						aEl.target = '_blank';
					}

					//report download pages for Report Writer (csv, txt, fixed text)
					if(aEl.href.search(/rptDownload\.asp/i) !==  -1){
						aEl.target = '_blank';
					}

					//link on Nav Default home page for why Sub Preference Lists are important
					if(aEl.href.search(/prefList\.htm/i) !==  -1){
						aEl.target = '_blank';
					}
				}

				try {
					//handle the external training links and tip of the month links
					var traininglinks = cDoc.getElementById('traininglinks').getElementsByTagName('a');
					for (var t = 0; t < traininglinks.length; t++) {
						var tEl = traininglinks[t];
						if (tEl.href.search(/frontlinek12.com/i) !== -1) {
							tEl.target = '_blank';
						}
					}
					//tip of the month links
					var messageTables = cDoc.getElementsByClassName('headerTable');
					var tipsOfTheMonthSection = messageTables[messageTables.length-1].getElementsByClassName('dataTD');
					var tips = tipsOfTheMonthSection[tipsOfTheMonthSection.length-1].getElementsByTagName('a');
					for (var m = 0; m < tips.length; m++) {
						var mEl = tips[m];
						if (mEl.href.search(/^http((?!aesoponline).)*\.com.*$/i) !== -1) {
							mEl.target = '_blank';
						}
					}
				} catch(err) {}

				fBody.style.margin = '0px';
				fBody.style.background = 'transparent';
				fBody.style.overflowY = 'hidden';

				cWin.$('body').css({
					'-webkit-text-size-adjust': 'none',
					'-webkit-font-smoothing': 'antialiased',
					'-moz-osx-font-smoothing': 'grayscale',
					'text-rendering': 'optimizeLegibility'
				});

				// cWin.$('body > table:first-of-type').css({
				// 	'margin': '-20px -20px 0px -20px'
				// });

				cWin.$('body > table:last-of-type').css({
					'border-left': '15px solid white',
					'border-right': '5px solid white'
				});

				cWin.$('.navigator-reports-container').css({
					'padding': '1.5rem',
					'overflow': 'auto'
				});

				//Print specific CSS. Applied via JS to the iframe's body, because you can't affect a child's page in an iframe with parent CSS
				//adjust body and navigitator-reports-container CSS so we can fit everything on the printout.
				//see http://stackoverflow.com/questions/6646489/printed-parent-window-of-iframed-pages-causes-odd-scaling
				//also, reverse any custom CSS applied above for screen display around navigator-reports-container
				var mediaQueryPrintCss = `<style media="print">
					@media print {
                        			body { width: 1150px; zoom: 95%; }
					 	.navigator-reports-container { width: 1000px !important; padding: 0 !important; overflow: hidden !important;
						 	display:block; zoom:1;
						 }
					 	.navigator-reports-container > table { width: 1000px !important; }
					}
				</style>`;
				cWin.$('head').append(mediaQueryPrintCss);

				//fixing relative link from cancel button in report writer
				el = cWin.$('#ConfigReportFilters1_btnCancel,#ConfigReport1_btnCancel,#ConfigLetter1_btnFilterCancel,#ConfigLetter1_btnCancel,#ExecuteReport1_btnCancel,#ConfigLetter1_btnFilterCancel');
				if(el != null){
					el.click(function(e){
						e.preventDefault();
						cWin.history.back();
					});
				}
			}
		};

	});
	// #--- END Helper (navigatorProxyHelp) ---# //
	// #---------------------------------------# //

}());
