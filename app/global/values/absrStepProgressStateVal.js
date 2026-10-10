(function() {'use strict';var app = angular.module('aesop');

	// #--------------------------------------------# //
	// #----- Value (absrStepProgressStateVal) -----# //
	app.value('absrStepProgressStateVal', {
		types: {
			absence: [{
				title: 'Absence.Create.Text.SelectEmployee',
				cls:'fl-primary',
				route: '/abs-mgt/absences/create-absence'
			},{
				title: 'Absence.Create.Text.FillOutDetails',
				cls:'fl-primary',
				route: '/abs-mgt/absences/create-absence-details'
			},{
				title: 'Absence.Create.Text.Review&Confirm',
				cls:'fl-primary',
				route: '/abs-mgt/absences/create-absence-review'
			},{
				title: 'Done',
				buttons: [{
					title: 'Absence.Create.Text.CreateAbsenceAndAssignSub',
					cls:'label-green',
					route: '/abs-mgt/absences/create-absence-assign'
				},{
					title: 'Absence.Create.Text.CreateAbsence',
					cls:'fl-positive',
					route: '/abs-mgt/absences/create-absence-save'
				}]
			}],
			vacancy: [{
				title: 'Absence.Create.Text.SelectProfile',
				cls:'fl-primary',
				route: '/abs-mgt/absences/create-vacancy'
			},{
				title: 'Absence.Create.Text.FillOutDetails',
				cls:'fl-primary',
				route: '/abs-mgt/absences/create-vacancy-details'
			},{
				title: 'Absence.Create.Text.Review&Confirm',
				cls:'fl-primary',
				route: '/abs-mgt/absences/create-vacancy-review'
			},{
				title: 'Done',
				buttons: [{
					title: 'Absence.Create.Text.CreateVacancyAndAssignSub',
					cls:'label-green',
					route: '/abs-mgt/absences/create-vacancy-assign'
				},{
					title: 'Absence.Create.Text.CreateVacancy',
					cls:'fl-positive',
					route: '/abs-mgt/absences/create-vacancy-save'
				}]
			}],
			substituteAbsence:[{
				title: 'SubstituteAbsence.Create.Text.SelectSubstitute',
				cls:'fl-primary',
				route: '/abs-mgt/substitute-absences/create-substitute-absence'
			},{
				title: 'SubstituteAbsence.Create.Text.FillOutDetails',
				cls:'fl-primary',
				route: '/abs-mgt/substitute-absences/create-substitute-absence-details'
			},{
				title: 'SubstituteAbsence.Create.Text.Review&Confirm',
				cls:'fl-primary',
				route: '/abs-mgt/substitute-absences/create-substitute-absence-review'
			},{
				title: 'Done',
				buttons: [{
					title: 'Absence.Create.Text.CreateAbsence',
					cls:'fl-positive',
					route: '/abs-mgt/substitute-absences/create-substitute-absence-done'
				}]
			}]
		}
	});
	// #--- END Value (absrStepProgressStateVal) ---# //
	// #--------------------------------------------# //

}());