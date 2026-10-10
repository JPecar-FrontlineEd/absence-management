(function() {'use strict';angular.module('aesop')
.controller('TimeSheetCtrl', function ($scope,stringSvc,$location,substituteApi,toastHelp,timeSheetApi,permissionSvc,$q,$filter,arrayHelp,$window) {
// #-----------------------------# //
// #------- TimeSheetCtrl -------# //

	// this is a route controller
	var route = this,
	subId = 0,
	tspId = 0,
	statusColumnWidth='8%',
	dateColumnWidth='8%',
	locationColumnWidth='15%',
	employeeCoumnWidth='15%',
	startColumnWidth='12%',
	endColumnWidth='11%',
	breakTimeColumnWidth='14%',
	breakHoursColumnWidth='6%',
	totalHoursColumnWidth='6%',
	unitsColumnWidth='5%';

	var canMarkPaper = permissionSvc.iHave('RPTTS.MARKPAPER');

	var strings = $scope.strings = stringSvc.getStrings([
		'ts.enterTimeSheet.label.timeSheetFor',
		'ts.enterTimeSheet.label.returnSummaryReport',
		'ts.enterTimeSheet.label.log',
		'ts.enterTimeSheet.tableHeader.date',
		'ts.enterTimeSheet.tableHeader.location',
		'ts.enterTimeSheet.tableHeader.employee',
		'ts.enterTimeSheet.tableHeader.schStart',
		'ts.enterTimeSheet.tableHeader.actStart',
		'ts.enterTimeSheet.tableHeader.schEnd',
		'ts.enterTimeSheet.tableHeader.actEnd',
		'ts.enterTimeSheet.tableHeader.breakTimes',
		'ts.enterTimeSheet.tableHeader.breakHours',
		'ts.enterTimeSheet.tableHeader.totalHours',
		'ts.enterTimeSheet.tableHeader.units',
		'ts.enterTimeSheet.legend.label.approved',
		'ts.enterTimeSheet.legend.label.noVals',
		'ts.enterTimeSheet.legend.label.rejected',
		'ts.enterTimeSheet.legend.label.removed',
		'ts.enterTimeSheet.legend.label.paper',
		'ts.enterTimeSheet.label.comments',
		'ts.tsrow.title.noValEntered',
		'ts.tsrow.title.clearValues',
		'ts.tsrow.title.rej',
		'ts.label.markpaper',
		'ts.tsrow.title.noLongerAssigned',
		'ts.label.delete',
		'ts.label.undelete',
		'ts.tsitem.labelApproved',
		'ts.label.unmarkpaper',
		'ts.tsrow.label.start',
		'ts.tsrow.label.end',
		'ts.tsrow.label.breakNotEntered',
		'ts.tsrow.label.na'
	]);

	// View Model properties
	route.vm = $scope.vm =  {
		substitute: {id:0,name:''},
		noTimeSheet:true,
		isLoading:true,
		canMarkPaper:permissionSvc.iHave('RPTTS.MARKPAPER'),
		outOfViewablePeriods:false,
		tsId:0,
		loadingHeader:true,
		cols:[{
			key:'status',
			title:'',
			template:'<div ng-if="row.showStatusHtml" class="status-inner-cell" ng-class="{\'approved\':row.approvedStatus,\'no-val-back\':row.status===0,\'rej\':row.status===5}" ng-bind-html="row.statusHtml"></div>'+
			'<div ng-if="row.showPaperButton" ng-click="go.MarkAsPaper(row,true)" ng-class="{\'no-val-paper\':row.status===0}" class="paper-button"><button class="fl-button-sm" title="'+strings['ts.label.markpaper']+'"><i ng-show="row.markingAsPaper" class="fa-spinner fa-spin"></i><span ng-show="!row.markingAsPaper">'+strings['ts.label.markpaper']+'</span></button></div>'+
			'<div ng-if="row.showUnMarkPaperButton" ng-click="go.MarkAsPaper(row,false)" class="paper-button"><button class="fl-button-sm" title="'+strings['ts.label.unmarkpaper']+'"><i class="fa-spinner fa-spin" ng-show="row.markingAsPaper"></i><span ng-show="!row.markingAsPaper">'+strings['ts.label.unmarkpaper']+'</span></button></div>',
			//width:fractionClass('2/24' || '1'),
			width:{'width':statusColumnWidth}
		},{
			key:'date',
			title:strings['ts.enterTimeSheet.tableHeader.date'],
			template:'{{row.actualDate}}',
			//width:fractionClass('2/24' || '1'),
			width:{'width':dateColumnWidth}
		},{
			key:'location',
			title:strings['ts.enterTimeSheet.tableHeader.location'],
			template:'{{row.location}}',
			width:{'width':locationColumnWidth}
			//width:fractionClass('2/24' || '1'),
		},{
			key:'employee',
			title:strings['ts.enterTimeSheet.tableHeader.employee'],
			template:'{{row.workName}}',
			width:{'width':employeeCoumnWidth}
			//width:fractionClass('3/24' || '1'),
		},{
			key:'schdStart',
			title:'<div class="top-heading">'+strings['ts.enterTimeSheet.tableHeader.schStart']+'</div><div>'+strings['ts.enterTimeSheet.tableHeader.actStart']+'</div>',
			template:'<div class="scheduled">{{row.startTime}}</div><div class="actual">{{row.astart}}</div>',
			width:{'width':startColumnWidth}
			//width:fractionClass('3/24' || '1'),
		},{
			key:'schdEnd',
			title:'<div class="top-heading">'+strings['ts.enterTimeSheet.tableHeader.schEnd']+'</div><div>'+strings['ts.enterTimeSheet.tableHeader.actEnd']+'</div>',
			template:'<div class="scheduled">{{row.endTime}}</div><div class="actual">{{row.aend}}</div>',
			width:{'width':endColumnWidth}
			//width:fractionClass('3/24' || '1'),
		},{
			key:'break',
			title:strings['ts.enterTimeSheet.tableHeader.breakTimes'],
			template:'<div ng-if="!row.noBreak" class="break-titles"><div class="left">'+strings['ts.tsrow.label.start']+'</div><div class="left">'+strings['ts.tsrow.label.end']+'</div></div>'+
			'<div ng-if="!row.noBreak">{{row.bStart}} - {{row.bEnd}}</div>'+
			'<div ng-if="row.noBreak">'+strings['ts.tsrow.label.breakNotEntered']+'</div>',
			width:{'width':breakTimeColumnWidth}
			//width:fractionClass('3/24' || '1'),
		},{
			key:'breakhours',
			title:strings['ts.enterTimeSheet.tableHeader.breakHours'],
			template:'<div ng-if="row.totalHours !== \'-1\'">{{row.breakHours}}</div>'+
			'<div class="na" ng-if="row.totalHours === \'-1\'">'+strings['ts.tsrow.label.na']+'</div>',
			width:{'width':breakHoursColumnWidth}
			//width:fractionClass('2/24' || '1'),
		},{
			key:'totalhours',
			title:strings['ts.enterTimeSheet.tableHeader.totalHours'],
			template:'<div title="{{ row.totalHours }}" ng-if="row.totalHours !== \'-1\'">{{row.totalHours}}</div>'+
			'<div class="na" ng-if="row.totalHours === \'-1\'">'+strings['ts.tsrow.label.na']+'</div>',
			width:{'width':totalHoursColumnWidth}
			//width:fractionClass('2/24' || '1'),
		},{
			key:'totalunits',
			title:strings['ts.enterTimeSheet.tableHeader.units'],
			template:'<div ng-if="row.totalUnits !== \'-1\'">{{row.totalUnits}}</div>'+
			'<div class="na" ng-if="row.totalUnits === \'-1\'">'+strings['ts.tsrow.label.na']+'</div>',
			width:{'width':unitsColumnWidth}
			//width:fractionClass('2/24' || '1'),
		}],
		data:[],
		periods:[],
		institutions:[],
		instId:0,
		comments:[],
		currentPeriod:''
	};



	// Actions that can be bound to from the view
	route.go = $scope.go =  {
		GoBack: function () {
			$window.history.back();
		},
		MarkAsPaper:markAsPaper,
		Log:function(){
			$location.path('/WebTime/TimeSheet/'+route.vm.tsId+'/Log').search({back:'details'});
		}
	};

	function fractionClass(frac) {
			return '-u-' + frac.replace('/', '-');
	}


	function getSubstitute(subId){
		//console.log('getting sub data');
		substituteApi.getById({id: subId,fields:'id,lastName,firstName'})
  		.then(function(sub) {
  			route.vm.substitute.id = sub.id;
  			route.vm.substitute.name = sub.firstName+' '+sub.lastName;

  			//this is logic that will be needed for subweb but not for campus user
  			if(tspId !== 0){
  				var periodId;
  				getPeriods(0)
  				.then(function(data){
  					periodId = isTimesheetInCurrentPeriods(data);
	  				if(periodId === -1){
	  					getPeriods(tspId)
	  					.then(function(data){
	  						route.vm.outOfViewablePeriods = canMarkPaper;
	  						route.vm.currentPeriod = data[0].PeriodHeader;
	  						route.vm.loadingHeader=false;
	  						if(!getTimeSheetData()){
				  				//console.log('no timesheet data');
				  			}
	  					});
	  				}else{
	  					route.vm.outOfViewablePeriods = false;
	  					route.vm.currentPeriod=data[periodId].PeriodHeader;
	  					route.vm.loadingHeader=false;
	  					if(!getTimeSheetData()){
				  			//console.log('no timesheet data');
				  		}
	  				}
	  			});


  			}else{  //should only be sub
  				getPeriods(0)
  				.then(function(data){
  					route.vm.outOfViewablePeriods = false;
	  				route.vm.currentPeriod=data[0].PeriodHeader;
	  				route.vm.loadingHeader=false;
	  				if(!getTimeSheetData()){
				  		//console.log('no timesheet data');
				  	}
  				});
  			}


  		}, function (reason) {
				toastHelp.error(reason.$messages, 'Error');

		});
	}

	function isTimesheetInCurrentPeriods(periods){
		var foundPeriod = -1;
		for(var x =0; x<periods.length; x++){
			if(periods[x].Tsid === tspId){
				foundPeriod = x;
				break;
			}
		}
		return foundPeriod;
	}

	function processResults(data){
		route.vm.data = data.map(function(d){
           d.showPaperButton = route.vm.outOfViewablePeriods && (d.status===0 || d.status===5);
           d.showStatusHtml = d.status !== 8 || (d.status === 8 &&  !route.vm.outOfViewablePeriods);
           d.showUnMarkPaperButton = d.status === 8 &&  route.vm.outOfViewablePeriods;
           d.statusHtml = getStatusHtml(d.status,d.rejectedCount,d.tsutId,d.tsEnabled);
           d.astart = $filter('date')(parseTime(d.actualStartTime),'shortTime');
           d.aend = $filter('date')(parseTime(d.actualEndTime),'shortTime');
           d.bStart= $filter('date')(parseTime(d.breakStart),'shortTime');
           d.breakHours = calculateBreakTime(d.breakStart,d.breakEnd,d.defaultBreakTime);
           d.bEnd= $filter('date')(parseTime(d.breakEnd),'shortTime');
           d.noBreak=d.breakStart === '' && d.breakEnd === '';
           d.approvedStatus = d.status===4 || d.status === 3;
           d.markingAsPaper = false;

           populateInstitutions(d.instId,d.location);
           if(d.comments.length!==0){
           		populateComments(d.comments);
           }

            return d;
        });
	}

	function convertToApiModel(row){
		var apiModel = {};
		for(var key in row){
			if(key!=='showPaperButton' && key!=='showStatusHtml' && key!=='showUnMarkPaperButton' && key!=='showUnMarkPaperButton' && key!=='statusHtml' &&
				key!=='astart' && key!=='aend' && key!=='bStart' && key!=='breakHours' &&
				key!=='bEnd' && key!=='noBreak' && key!=='approvedStatus'){
					apiModel[key] = row[key];
			}
		}
		return apiModel;
	}

	function parseTime (time) {
		return Date.parse(time);
	}

	function calculateBreakTime(breakStart,breakEnd,defaultBreakTime){
		var unPaid;
		if (isNaN(convertTimeToDate(breakStart).getFullYear()) || isNaN(convertTimeToDate(breakEnd).getFullYear())) {
            unPaid=minutesToTime(defaultBreakTime);
        } else if (breakStart === '' || breakEnd === '') {
            unPaid = minutesToTime(defaultBreakTime);
        } else {
            var timeStart = convertTimeToDate(breakStart);
            var timeEnd = convertTimeToDate(breakEnd);

            var diff = timeEnd - timeStart;
            if (diff < 0) {
                unPaid = minutesToTime(defaultBreakTime());
                return true;
            }
            diff = diff / 60 / 1000;
            unPaid = minutesToTime(diff);

        }
        return unPaid;

	}

	function minutesToTime(time) {
        var hours = Math.floor(time / 60);
        var labelHours = hours.toString();
        var mins = time % 60;

        var labelMins = (mins < 10) ? '0' + mins.toString() : mins.toString();
        return labelHours + ':' + labelMins;
    }

    function convertTimeToDate(time) {
        return new Date('11/11/2011 ' + time);
    }

    function markAsPaper(row,markPaper){
    	row.markingAsPaper=true;
    	var paper = markPaper === true ? 1 : 2;
    	var tsItem = convertToApiModel(row);
    	timeSheetApi.saveTimesheet({'tsid':route.vm.tsId,'subId':subId,'paper':paper},tsItem)
    	.then(function(data){
    		row.status=data.status;
    		processResults(route.vm.data);
    		row.markingAsPaper=false;
    	});

    }

    function populateInstitutions(id,name){
    	var found = false;
    	for(var x=0; x<route.vm.institutions.length; x++){
    		if(route.vm.institutions[x].id === id){
    			found = true;
    			break;
    		}
    	}
    	if(!found){
    		route.vm.institutions.push({'id':id,'name':name});
    		route.vm.institutions.sort(arrayHelp.sort('name'));
		}
		route.vm.instId = route.vm.institutions[0].id;
    }

    function populateComments(comments){
    	var found = false;
    	for(var x=0; x<route.vm.comments.length; x++){

    		if(route.vm.comments[x][0].inst_id === comments[0].inst_id){
    			found = true;
    			break;
    		}
    	}
    	if(!found){
    		cleanComments(comments);
    		route.vm.comments.push(comments);
    		//route.vm.comments.sort(arrayHelp.sort('name'));
		}
		//console.log('test',route.vm.comments[0]);

    }

    function cleanComments(comments){
    	for(var x=0; x<comments.length; x++){
    		comments[x].message = unescape(comments[x].message);
    	}
    }

	function getTimeSheetData(mp,periodHeader){
		var params = {};
		params.subId=subId;

		if(route.vm.tsId!==0){
			params.id=route.vm.tsId;
			if(tspId!==0){
				params.tspId=tspId;
			}
		}else{
			//don't make call
			return false;
		}
		//console.log('getting timesheet data');
		timeSheetApi.getById(params)
		.then(function(data){
			//console.log('ts data',data);
			processResults(data);
			route.vm.isLoading=false;
		});
		return true;
	}

	function getPeriods(tpId){
		var _defer = $q.defer();
		var params = {};
		if(tpId>0){
			params.tspId = tpId;
		}
        //console.log('getting periods');

		timeSheetApi.getPeriods(params)
		.then(function(data){
			//console.log('got periods',data,tspId);
			return _defer.resolve(data);
		});
		return _defer.promise;
	}

	function getStatusHtml(status,rejectionCount,tsutId,tsEnabled){
		if(tsutId === 3){ //special case unit type = no timesheet
			return '';
		}else if(tsEnabled !== 1){ //special case timesheets not enabled
			return '';
		}else if(status === 0){
			return '<div title="'+strings['ts.tsrow.title.noValEntered']+'" class="no-val"></div>';
		}else if(status === 4 || status === 3){
			return '<div title="'+strings['ts.tsitem.labelApproved']+'" class="approved-val"></div>';
		}else if(status === 8){
			return '<div title="Paper Timesheet" class="paper-val"></div>';
		}else if(status === 9){
			return '<div title="'+strings['ts.tsrow.title.noLongerAssigned']+'" class="not-assigned-val"></div>';
		}else if(status === 5){
			return '<div title="'+strings['ts.tsrow.title.rej']+'" class="rejected-val"></div>'+
                '<span class="rejected-count" >'+rejectionCount+'</span>';
		}else{
			return '';
		}
	}



	function getQueryParameters(){
		var queryString = $location.search();
		if(queryString.SubId){
			subId=queryString.SubId;
			getSubstitute(subId);
		}
		if(queryString.TspId){
			tspId=parseInt(queryString.TspId);
		}
		if(queryString.TsId){
			route.vm.tsId=queryString.TsId;
		}

	}

	getQueryParameters();

// #----- END TimeSheetCtrl -----# //
});}());