(function () {'use strict';
	describe('testing (navigatorUrlHelp)', function () {
		var navigatorUrlHelp;
		beforeEach(inject(function (_navigatorUrlHelp_) {
			navigatorUrlHelp = _navigatorUrlHelp_;
		}));

		// #---------------------------------------------# //
		// #---- Helper Unit Test (navigatorUrlHelp) ----# //

		// jasmine tests for helper functions
		it('should return the Angular equivalent of the report selection url', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/reportSelection.asp')).toBe('/abs-mgt/reports/report-writer/');
		});
		it('should pass Absence Modify url through to handle approver email links', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/absenceModify.asp')).toBe('/absenceModify.asp');
		});
		it('should pass Absence Approve List url through to handle approver email links', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/abs_ApproveList.asp')).toBe('/abs_ApproveList.asp');
		});
		it('should prepend Data Import url from emails with /navigator to work in the iFrame', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/mvc.aspx/dataimport')).toBe('/navigator/mvc.aspx/dataimport');
		});
		it('should prepend Feedback(teacher) url from emails with /navigator to work in the iFrame', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/te_feedback.asp')).toBe('/navigator/te_feedback.asp');
		});
		it('should prepend Feedback(substitute) url from emails with /navigator to work in the iFrame', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/sub_feedback.asp')).toBe('/navigator/sub_feedback.asp');
		});

		//Handling report urls that could come from emails or from Report Writer redirection for Campus Users executing reports
		it('should prepend Report Summary page url from emails with /navigator to work in the iFrame', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/reportConfigSummary.asp')).toBe('/navigator/reportConfigSummary.asp');
		});
		it('should not do anything if the Report Summary page url also contains the Angular route for Report view', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/abs-mgt/reports/report-writer/3535434/view/reportConfigSummary.asp')).toBe('/abs-mgt/reports/report-writer/3535434/view');
		});
		it('should prepend Report Execution Details page url from emails with /navigator to work in the iFrame', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/reportExecutionDetails.asp')).toBe('/navigator/reportExecutionDetails.asp');
		});
		it('should not do anything if the Report Execution Details page url also contains the Angular route for Report view', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/abs-mgt/reports/report-writer/3535434/view/reportExecutionDetails.asp')).toBe('/abs-mgt/reports/report-writer/3535434/view');
		});

		//Handling VeriTime redirection URLs
		it('should pass the reportConfigRedirect url through for Navigator', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/reportConfigRedirect.asp')).toBe('/reportConfigRedirect.asp');
		});
		it('should pass the Employee General Info url through for Navigator', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/te_general.asp')).toBe('/te_general.asp');
		});
		it('should pass the Sub General Info url through for Navigator', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/sub_general.asp')).toBe('/sub_general.asp');
		});
		it('should pass the Campus User/Org User General Info url through for Navigator', function () {
			expect(navigatorUrlHelp.getTokenRedirectUrl('/ou_general.asp')).toBe('/ou_general.asp');
		});

		// #-- END Helper Unit Test (navigatorUrlHelp) --# //
		// #---------------------------------------------# //
	});
}());