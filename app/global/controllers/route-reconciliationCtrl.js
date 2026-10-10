(function() {'use strict';angular.module('aesop')
.controller('ReconciliationCtrl', function ($filter, $state, absrSvc, shiftTypesSvc, stringSvc, permissionSvc) {
// #----------------------------------# //
// #------- ReconciliationCtrl -------# //

    // this is a route controller
    var route = this;
    var absrState = route.absrState = absrSvc.getState();
    var canReconcileAll = permissionSvc.iHave('ABSR.RECONCILEALL');
    var showAccountingCode = absrState.context.showAccountingCode;
    var showBudgetCode = absrState.context.showBudgetCode;
    var showPayCode = absrState.context.showPayCode;
    var showHoursSubWorked = absrState.context.showHoursSubWorked;
    var showInstitution = absrState.context.showInstitution;
    var showCodes = showAccountingCode || showBudgetCode || showPayCode;

    var colDateWidth = '2/24';
    var colInstWidth = '4/24';
    var colReasonWidth = '3/24';
    var colDurationWidth = '2/24';
    var colStatusWidth = '13/24';

    var colCodesWidth = '5/24';
    var subHourworkedCol = '2/24';

    if(showCodes){
         colStatusWidth = '8/24';
    }
   if(showHoursSubWorked){
        colStatusWidth =  (showCodes ? '6' : '11') + '/24';
   }


    var buttons = [{
        title: 'Cancel',
        cls:'',
        icon: '',
        action:  function(){
            if(absrState.editMode){
                $state.go('base.detail.edit');
            }else{
                $state.go('base.detail.view');
            }
        }
    }];

    if(canReconcileAll){
        buttons.splice(1,0,{
            title: 'Reconcile.Button.Text.ReconcileAll',
            cls:'reconcile-all',
            icon:'',
            action: function(){
                route.go.reconcileAll();
            }
        });
    }

    var columns = [{
            key: 'date', width: colDateWidth,
            name: 'Table.Header.Date',
            sortable: false,
            template: '<div class="{{ row.cls }}">{{row.date}}</div>'
        },{
            key: 'school', width: colInstWidth,
            name:  showInstitution ? 'Dashboard.UnfilledTable.School.Title': 'Reconcile.Header.Text.Times',
            sortable: false,
            template: '<div class="{{ row.cls }}"> ' +
                    '<div class="inst-name" ng-if="row.showInstitution">{{ row.instName }}</div>'+
                    '<div class="time">{{ row.absenceTime }}</div>' +
                    '<div class="time">{{ row.vacancyTime }}</div>' +
                    '</div>'
        },{
            key: 'reason', width: colReasonWidth,
            name: 'Dashboard.UnfilledTable.Reason.Title',
            sortable: false,
            template: '<div class="{{ row.cls }}" title="{{row.reason}}">{{ row.reason }}</div>'
        },{
            key: 'duration', width: colDurationWidth,
            name: 'Table.Header.Duration',
            sortable: false,
            template: '<cmpt-template-shift-types  class="{{ row.cls }}" absences="[row.absence]"></cmpt-template-shift-types>'
        },{
            key: 'status', width: colStatusWidth,
            name: 'Table.Header.Reconcile.Status',
            sortable: false,
            template:'<div class="{{ row.cls }}">'+
                    '<span ng-class="{\'unreconciled\': !row.isReconciled }">{{ row.isReconciled ? "Reconciled": "Unreconciled" }}</span>'+
                    '<a class="fl-button" ng-class="{\'fl-positive\': !row.isReconciled, \'fl-disabled\': row.disabled }" ng-click="actions.reconciliation(row)"> ' +
                    '<div class="fl-label">' +
                    '<i class="fa pull-left" ng-class="{\'fa-spinner\': row.isProcessing, \'fa-times\': !row.isProcessing && row.isReconciled, \'fa-check\': !row.isProcessing && !row.isReconciled }"></i>' +
                    '{{ row.isReconciled ? "Unreconcile": "Reconcile" }}'+
                    '</div>'+
                    '</a>' +
                    '<div class="error" ng-repeat="error in row.errors track by $index">{{ error }}</div>' +
                    '</div>'
        }];


    if(showCodes){
        columns.splice(4,0,{
            key: 'codes', width: colCodesWidth,
            name: 'Table.Header.Codes',
            sortable: false,
            template: '<div class="{{ row.cls }}"> ' +
                    '<div class="code" ng-if="row.showAccountingCode">Acct. Code: {{row.accountingCode}}</div>'+
                    '<div class="code" ng-if="row.showBudgetCode">Bud. Code: {{row.budgetCode}}</div>'+
                    '<div class="code" ng-if="row.showPayCode">Pay Code: {{row.payCode}}</div>'+
                    '</div>'
        });
    }
    if(showHoursSubWorked){
        columns.splice(columns.length - 1,0,{
            key: 'subhour', width: subHourworkedCol,
            name: 'Table.Header.SubHrsWorked',
            sortable: false,
            template: '<div class="{{ row.cls }}">{{row.hoursSubWorked}}</div>'
        });
    }


    function processData () {
        var absences = [];
        var showVacancyTimes = absrState.context.showVacancyTimes || absrState.context.needSub === 0;

        absences = absrState.absr.absences.filter(function (a){
            return a.closedDay === null || a.closedDay.closedDayType === 2;
        }).map(function (a){
            var canReconcile = a.canReconciled;
            var obj = {};
            obj.id = a.id;
            obj.date = $filter('parseAesopDate')(a.date);
            obj.showInstitution = showInstitution;
            obj.instName = a.institution.name;
            obj.showVacancyTimes = showVacancyTimes;
            obj.absenceTime = ((showVacancyTimes) ? route.strings['DR.Tab.Table.Data.Text.Emp'] + ': ' : '') + $filter('date')(Date.parse(a.absenceStartTime),'shortTime') + ' - ' + $filter('date')(Date.parse(a.absenceEndTime), 'shortTime');
            obj.vacancyTime = (showVacancyTimes) ? route.strings['DR.Tab.Table.Data.Text.Sub'] + ': ' + $filter('date')(Date.parse(a.substituteStartTime), 'shortTime') + ' - ' + $filter('date')(Date.parse(a.substituteEndTime),'shortTime') : '';
            obj.reason = a.entitlement.name;
            obj.duration = shiftTypesSvc.oneById(a.substituteShiftType);
            obj.showAccountingCode = showAccountingCode;
            obj.accountingCode = (showAccountingCode)? a.accountingCode == null ? route.strings['NoneSelected'] : a.accountingCode.name : '';
            obj.showBudgetCode = showBudgetCode;
            obj.budgetCode = (showBudgetCode) ? a.budgetCode == null ? route.strings['NoneSelected'] : a.budgetCode.description: '';
            obj.showPayCode = showPayCode;
            obj.payCode = (showPayCode) ? a.payCode == null ? route.strings['NoneSelected'] : a.payCode.description: '';
            obj.hoursSubWorked = a.hoursSubWorked;
            obj.isReconciled = a.isReconciled;
            obj.canReconcile = canReconcile;
            obj.cls = canReconcile ? '': 'can-reconcile' ;
            obj.isProcessing=  false;
            obj.absence = a;
            obj.disabled = false;
            obj.errors=[];
            return obj;
        });
        return absences.sort(function (a,b){
            return new Date(a.date) - new Date(b.date);
        });
    }

    route.strings = stringSvc.getStrings([
        'Cancel',
        'Reconcile.Button.Text.ReconcileAll',
        'NoneSelected',
        'DR.Tab.Table.Data.Text.Emp',
        'DR.Tab.Table.Data.Text.Sub'
    ]);
    // View Model properties
    var dataSet = processData();
    route.vm = {
        isProcessing: false,
        buttons: buttons,
        columns: columns,
        dataSet: dataSet,
        multipleAbsencesToReconcile: false
    };

    function multipleAbsencesToReconcile () {
        return route.vm.dataSet.filter(function (a){ return a.canReconcile && !a.isReconciled; }).length > 1;
    }

    route.vm.multipleAbsencesToReconcile = multipleAbsencesToReconcile();
    // Actions that can be bound to from the view
    route.go = {
        reconciliation: function (row) {
            if(!row.isProcessing && row.canReconcile && !row.disabled){
                row.errors  = [];
                buttonsState(row.id,true);
                row.isProcessing = true;
                if(row.isReconciled){
                    unreconcile(row);
                }else{
                    reconcile(row);
                }
            }
        },
        reconcileAll: function (){
            if(!route.vm.isProcessing){
                var absIds = route.vm.dataSet.filter(function (a){
                    return a.canReconcile && !a.isReconciled;
                }).map(function(a){
                    return a.id;
                });
                if(absIds.length > 0){
                    route.vm.isProcessing = true;
                    absrSvc.reconcile(absrState.id,absIds.join(',')).then(function(){
                        route.vm.dataSet.forEach(function (a) { a.errors.length = 0;});
                        route.vm.dataSet.filter(function (a){
                            return a.canReconcile && !a.isReconciled;
                        }).forEach(function(a){
                            a.isReconciled = true;
                        });
	                    absrState.absrVariations
		                    .map(function(v) { return v.absences })
		                    .reduce(function(a, b) { return a.concat(b); }, [])
		                    .filter(function(a) { return a.canReconciled && !a.isReconciled })
		                    .forEach(function(a) { a.isReconciled = true; });
                        route.vm.isProcessing = false;
                        absrState.absr.absences.forEach(function (a){ return a.isReconciled = true; });
                        route.vm.multipleAbsencesToReconcile = multipleAbsencesToReconcile();
                    },function (reasons){
                        route.vm.isProcessing = false;
                        reasons.$messages.forEach(function (msg){
                            route.vm.dataSet[msg.key].errors.push(msg.message);
                        });
                    });
                }
            }
        }
    };


    function reconcile (row) {
        absrSvc.reconcile(absrState.id, row.id).then(
            function () {
                row.isReconciled = true;
                row.isProcessing = false;
                route.vm.multipleAbsencesToReconcile = multipleAbsencesToReconcile();
				absrState.absr.absences.filter(function (a){ return a.id === row.id; })[0].isReconciled = true;
				absrState.absrVariations
					.map(function (v) { return v.absences })
					.reduce(function (a, b) { return a.concat(b); }, [])
					.find(function (a) { return a.id === row.id; }).isReconciled = true;
                buttonsState(row.id,false);
            },
            function (res) {
                row.errors = res.$messages.map(function(m){
                    if(angular.isString(m)){
                        return m;
                    }
                    return m.message;
                });
                row.isProcessing = false;
                buttonsState(row.id,false);
            }
        );
    }
    function unreconcile (row) {
        absrSvc.unreconcile(absrState.id, row.id).then(
            function () {
                row.isReconciled = false;
                row.isProcessing = false;
                route.vm.multipleAbsencesToReconcile = multipleAbsencesToReconcile();
				absrState.absr.absences.filter(function (a) { return a.id === row.id; })[0].isReconciled = false;
	            absrState.absrVariations
		            .map(function (v) { return v.absences })
		            .reduce(function (a, b) { return a.concat(b); }, [])
		            .find(function (a) { return a.id === row.id; }).isReconciled = false;
                buttonsState(row.id,false);
            },
            function (res) {
                row.errors = res.$messages.map(function(m){
                    if(angular.isString(m)){
                        return m;
                    }
                    return m.message;
                });
                row.isProcessing = false;
                buttonsState(row.id,false);
            }
        );
    }


    function buttonsState (absId, disable) {
        route.vm.dataSet.forEach(function (a){ if(a.id !== absId) { a.disabled = disable; } });
    }


// #----- END ReconciliationCtrl -----# //
});}());