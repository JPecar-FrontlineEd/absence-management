(function() {'use strict';var app = angular.module('aesop');

	// #---------------------------------# //
	// #----- Service (feedbackSvc) -----# //
	app.factory('feedbackSvc', function ($q, $filter, stringSvc, absrStateVal, workerTypeApi, absenceRequestApi, toastHelp, arrayHelp, absrVariationHelp, ngDialog, scrollHelp) {

		var survey = {};

		var apiMethod = {
			feedbackAboutSubstitute: {
				post: 'addWorkerFeedback',
				put: 'updateWorkerFeedback',
				delete: 'deleteWorkerFeedback',
				questions: 'workerQuestion'
			},
			feedbackFromSubstitute: {
				post: 'addSubstituteFeedback',
				put: 'updateSubstituteFeedback',
				delete: 'deleteSubstituteFeedback',
				questions: 'substituteQuestion'
			}
		};

		setupServeyObj();
		function setupServeyObj () {
			//TODO: need a blank object for survey
			survey = {};
			survey['feedbackAboutSubstitute'] = { rating: 0, ratingError: false, response: [] };
			survey['feedbackFromSubstitute'] = { rating: 0, ratingError: false, response: [] };
		}

		function getProperty(aboutSubstitute){
			return (aboutSubstitute) ? 'feedbackAboutSubstitute' : 'feedbackFromSubstitute';
		}
		function getAnswers(aboutSubstitute){
			var feedback = absrStateVal.absr.feedBack;
			if (feedback) {
				return (aboutSubstitute ? feedback.workerAnswers : feedback.substituteAnswers) || [];
			}
			return [];
		}
		function getRating(aboutSubstitute){
			var feedback = absrStateVal.absr.feedBack;
			if (feedback) {
				return (aboutSubstitute ? feedback.ratingOfSub : feedback.ratingOfSubsExperience) || 0;
			}
			return 0;
		}

		function setSurvey (aboutSubstitute) {
			var _defer = $q.defer();
			var answersDic = {};
			var answers = getAnswers(aboutSubstitute);
			var surveyObj = survey[getProperty(aboutSubstitute)];
			surveyObj.rating = getRating(aboutSubstitute);
			if (surveyObj.response.length === 0) {
				answers.forEach(function (answer){
					answersDic[answer.questionId] = answer;
				});
				setupQuestions(aboutSubstitute).then(function(questionsDic){
					Object.keys(questionsDic).forEach(function (key){
						surveyObj.response.push({
							questionId: questionsDic[key].id,
							order: questionsDic[key].order,
							question: questionsDic[key].question,
							required: questionsDic[key].required,
							answerId: answersDic[key] == null ? 0 : answersDic[key].id,
							answer: answersDic[key] == null ? '' : answersDic[key].response,
							errors:[]
						});
					});
					return _defer.resolve(surveyObj);
				}, function(){
					return _defer.reject();
				});
			} else {
				_defer.resolve(surveyObj);
			}

			return _defer.promise;
		}

		function setupQuestions(aboutSubstitute){
			var _defer = $q.defer();
			var objProp = getProperty(aboutSubstitute);
			var method = apiMethod[objProp].questions;
			var questionsDic = {};
			var worker = absrStateVal.absr.worker;

			workerTypeApi[method]({ wktid:  worker.workerType.id}).then(function (questions){
				questions.forEach(function (question){
					questionsDic[question.id] = question;
				});
				return _defer.resolve(questionsDic);
			}, function (errors){
				toastHelp.error(errors.$messages,'Error');
				return _defer.reject();
			});

			return _defer.promise;
		}

		function substituteHtml () {
			var html = '';
			html += '<div class="content">';
			html += '<div>Substitute Report Time<div>';
			html += '<div>{{ absence.vacancyTime }}</div>';
			html += '<cmpt-template-shift-types absences="[absence]"></cmpt-template-shift-types>';
			html += '</div>';
			return html;
		}

		function getAbsences () {
			return absrStateVal.absr.absences.map(function (a){
				return {
					date: $filter('parseAesopDate')(a.date),
					entitlement: a.entitlement.name,
					institution: {id: a.institution.id, name: a.institution.name},
					absenceTime: $filter('date')(parseTime(a.absenceStartTime),'shortTime') + '-' + $filter('date')(parseTime(a.absenceEndTime),'shortTime'),
					vacancyTime: $filter('date')(parseTime(a.substituteStartTime),'shortTime') + '-' + $filter('date')(parseTime(a.substituteEndTime),'shortTime'),
					absenceDuration: a.absenceDuration.slice(0,-3),
					shiftType: a.shiftType,
					substituteShiftType: a.substituteShiftType,
					substituteHtml: substituteHtml()
				};
			}).sort(function (a,b){
	            return new Date(a.date) - new Date(b.date);
	        });
		}

		function getVariations () {
			return absrStateVal.absrVariations.map(function (variation, index){
				return {
					variationTitle: 'Variation ' + (index +1),
					dateStr: absrVariationHelp.dateString(variation.dates,absrStateVal.context.dragSelectDOW),
					entitlement: variation.entitlementType.value,
					institution: {id: variation.institution.id, name: variation.institution.value},
					absenceTime: $filter('date')(parseTime(variation.absenceStartTime),'shortTime') + '-' + $filter('date')(parseTime(variation.absenceEndTime),'shortTime'),
					vacancyTime: $filter('date')(parseTime(variation.vacancyStartTime),'shortTime') + '-' + $filter('date')(parseTime(variation.vacancyEndTime),'shortTime'),
					shiftType: variation.absences[0].shiftType,
					substituteShiftType: variation.absences[0].substituteShiftType,
					substituteHtml: substituteHtml()
				};
			});
		}
		function parseTime (time) {
			return Date.parse(time);
		}


		function setupObjectToSave (aboutSubstitute) {
			if(validate(aboutSubstitute)){
				var surveyObj = survey[getProperty(aboutSubstitute)];
				var saveObj = {
					ratingOfSub: surveyObj.rating,
					ratingOfSubsExperience: surveyObj.rating,
					workerAnswers:[],
					substituteAnswers:[]
				};
				surveyObj.response.forEach(function (item){
					saveObj[(aboutSubstitute) ? 'workerAnswers': 'substituteAnswers'].push({
						id: item.answerId,
						response: item.answer,
						questionId: item.questionId
					});
				});
				return saveObj;
			}
			return null;
		}

		function validate (aboutSubstitute) {
			var errorIndex = [];
			var surveyObj = survey[getProperty(aboutSubstitute)];
			if (surveyObj.rating > 0) {
				surveyObj.ratingError = false;
			} else {
				surveyObj.ratingError = true;
				errorIndex.push(0);
			}
			surveyObj.response.forEach(function (item, index){
				item.errors.length = 0;
				if(item.required && item.answer.length === 0){
					item.errors.push('This is a required field.');
					errorIndex.push(index + 1);
				}
			});
			scrollHelp.scrollTo('item-' +  Math.min.apply(Math, errorIndex));
			return errorIndex.length === 0;
		}


		function backupFeedback(aboutSubstitute){
			var objProp = getProperty(aboutSubstitute);
			survey[objProp + 'Original'] = angular.copy(survey[objProp]);
		}




		function saveFeedbackAboutSubstitute () {
			var answers = getAnswers(true);
			var objProp = getProperty(true);
			var method = answers.length === 0 ? apiMethod[objProp].post : apiMethod[objProp].put;
			return saveFeedback(true, method);
		}

		function saveFeedbackFromSubstitute () {
			var answers = getAnswers(false);
			var objProp = getProperty(false);
			var method = answers.length === 0 ? apiMethod[objProp].post : apiMethod[objProp].put;
			return saveFeedback(false, method);
		}


		function saveFeedback (aboutSubstitute, method) {
			var _defer = $q.defer();
			var saveObj = setupObjectToSave(aboutSubstitute);
			if(saveObj == null){
				return $q.reject();
			}
			var saveFeedbackAction = absenceRequestApi[method]({ absrid: absrStateVal.id }, saveObj);
			saveFeedbackAction.then(function (){
				updateAbsrState(aboutSubstitute);
				delete survey[ getProperty(aboutSubstitute) +'Original'];
				return _defer.resolve();
			},function(){
				return _defer.reject();
			});
			return _defer.promise;
		}

		function updateAbsrState(aboutSubstitute){
			var objProp = getProperty(aboutSubstitute);
			var ratingProp = aboutSubstitute ? 'ratingOfSub' : 'ratingOfSubsExperience';
			var answersProp = aboutSubstitute ? 'workerAnswers' : 'substituteAnswers';

			if (!absrStateVal.absr.feedBack) {
				absrStateVal.absr.feedBack = {};
			}
			
			var feedback = absrStateVal.absr.feedBack;
			feedback[ratingProp] = survey[objProp].rating;
			feedback[answersProp] = survey[objProp].response.length === 0 ? []
										: survey[objProp].response.map(function (r){
											var answer = {};
											answer.id = r.answerId;
											answer.response = r.answer;
											answer.questionId = r.questionId;
											return answer;
										});
			//watch on this value to check if feedback exists or not
			absrStateVal.lastUpdated = new Date();
		}

		function resetFeedback (aboutSubstitute) {
			var objProp = getProperty(aboutSubstitute);
			if(survey.hasOwnProperty(objProp + 'Original')){
				survey[objProp].rating = survey[objProp + 'Original'].rating;
				survey[objProp].response = survey[objProp + 'Original'].response;
				survey[objProp].ratingError = false;
				delete survey[ objProp +'Original'];
			} else {
				survey[objProp].rating = 0;
				survey[objProp].response = [];
				survey[objProp].ratingError = false;
			}
		}

		/*******************************************************Delete Feedback*********************************************/

		var strings = stringSvc.getStrings([
	        'Dialog.Title.DeleteFeedbackConfirmation',
			'DeleteConfirm.SubExpFeedback',
			'DeleteConfirm.SubFeedback',
			'Substitute', 'Employee',
			'Cancel', 'Delete'
	    ]);

		function deleteFeedbackDialog(aboutSubstitute){
			var worker = absrStateVal.absr.worker;
			var substitute = absrStateVal.absr.substitute;
			var workerName = worker.lastName + ', ' + worker.firstName;
			var subName = substitute.lastName + ', ' + substitute.firstName;
			var absrInfoText = '#' + absrStateVal.id + ' - ' + (aboutSubstitute ? subName + ' ('+strings['Substitute']+')' : workerName + ' ('+strings['Employee']+')');

			var dialog = ngDialog.open({
				template:'/components/feedback/cmpt-feedback-buttons/feedback-delete-confirmation.html',
				closeByDocument: false,
				closeByNavigation: true,
				showClose: false,
				data: {
					header: strings['Dialog.Title.DeleteFeedbackConfirmation'],
					confirmMessage: aboutSubstitute ? strings['DeleteConfirm.SubFeedback'] : strings['DeleteConfirm.SubExpFeedback'],
					absrInfoText: absrInfoText,
					absr: absrStateVal.absr,
					showApprovalStatus: absrStateVal.context.showApprovalStatus,
					buttons: [{
						title: strings['Delete'],
						cls:'fl-button fl-negative',
						icon: '',
						loading: false,
						enabled: true,
						action:  function(){
							var button = this;
							if(!button.loading){
								button.loading = true;
								deleteFeedback(aboutSubstitute).then(function(){
									button.loading = false;
									ngDialog.close(dialog.id);
								}, function(){
									button.loading = false;
								});
							}
						}
					},{
						title: strings['Cancel'],
						cls:'fl-button',
						icon:'',
						enabled: true,
						action: function(){
							ngDialog.close(dialog.id);
						}
					}]
				}
			});
		}
		function deleteFeedback(aboutSubstitute){
			var _defer = $q.defer();
			var objProp = getProperty(aboutSubstitute);
			var method = apiMethod[objProp].delete;

			absenceRequestApi[method]({absrid: absrStateVal.id})
				.then(function() {
					resetFeedback(aboutSubstitute);
					updateAbsrState(aboutSubstitute);
					setSurvey(aboutSubstitute);
					return _defer.resolve();
				}, function (reason) {
					toastHelp.error(reason.$messages, 'Error');
					return _defer.reject(reason);
				});

			return _defer.promise;
		}

		function isDirty (aboutSubstitute) {
			var objProp = getProperty(aboutSubstitute);
			var objectForDirtyCheck = survey[objProp];
			var orginalObject = survey[objProp + 'Original'];
			return !angular.equals(objectForDirtyCheck,orginalObject);
		}

		function hasBackup(aboutSubstitute) {
			var objProp = getProperty(aboutSubstitute);
			var orginalObject = survey[objProp + 'Original'];
			return orginalObject;
		}

		function hasFeedback(aboutSubstitute) {
			var answers = getAnswers(aboutSubstitute);
			var rating = getRating(aboutSubstitute);
			return answers.length > 0 && (rating != null || rating > 0);
		}


		/*******************************************************END Delete Feedback*********************************************/

		return {
			getSurvey: survey,
			setSurvey:setSurvey,
			setupQuestions: setupQuestions,
			getAnswers: getAnswers,
			getRating: getRating,
			saveFeedbackAboutSubstitute: saveFeedbackAboutSubstitute,
			saveFeedbackFromSubstitute: saveFeedbackFromSubstitute,
			substituteHtml: substituteHtml,
			getAbsences: getAbsences,
			getVariations: getVariations,
			deleteFeedbackDialog: deleteFeedbackDialog,
			backupFeedback: backupFeedback,
			resetFeedback: resetFeedback,
			hasFeedback: hasFeedback,
			hasBackup: hasBackup,
			isDirty: isDirty
		};

	});
	// #--- END Service (feedbackSvc) ---# //
	// #---------------------------------# //

}());
