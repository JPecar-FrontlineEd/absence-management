(function() {'use strict';var app = angular.module('aesop');

	// #------------------------------------# //
	// #----- Service (institutionSvc) -----# //
	app.factory('institutionSvc', function ($q, institutionApi, tokenSvc, storageSvc, stringSvc, $timeout, ngDialog) {

		var _defer = $q.defer(),
			_treeDataDefer = null,
			institutions = storageSvc.load({key: 'institutions'}),
			lookupTable = null,
			noPruneList = [],
			notFound = {};

		if (institutions) {
			if (!lookupTable) { buildLookupTable(); }
			_defer.resolve(institutions);
		} else {
			tokenSvc.ready.then(function(){
				institutionApi.get().then(function (data) {
					// cache in memory for reference
					institutions = data;

					// buil ref table for use in oneById
					buildLookupTable();

					institutions = data.map(function(i){
						i.availableChildrenCnt = availableChildrenCnt(i);
						return i;
					});

					// store the raw inst data
					storageSvc.save({
						key: 'institutions',
						data: data
					});
					_defer.resolve(data);
				});
			});
		}

		var strings = stringSvc.getStrings([
			'Close', 'VisibilityCalculator.Dialog.Text'
		]);

		function buildLookupTable() {
			var i = institutions.length;

			lookupTable = {};

			for (; i-- ;) {
				lookupTable[institutions[i].id] = i;
			}
		}

		function getInstitutions() {
			return _defer.promise.then(function (data) {
				return angular.copy(data);
			});
		}

		function noPrune(node) {
			noPruneList.push(node.id);
			if (node.parent != null && noPruneList.indexOf(node.parent) === -1) {
				noPrune(oneById(node.parent));
			}
		}

		function buildBranch(node, filterObj) {
			var i, child;

			if (node.isAvailable && (filterObj.value.length === 0 || node[filterObj.key].toLowerCase().indexOf(filterObj.value.toLowerCase()) !== -1)) {
				noPrune(node);
			}

			if (node.children && node.children.length) {
				i = node.children.length;
				for (; i-- ;) {
					child = angular.copy(oneById(node.children[i]));
					node.children[i] = buildBranch(child, filterObj);
				}
			}
			return node;
		}

		function prune(node) {
			if (node.children && node.children.length) {
				node.children = node.children.filter(function (v, i, a) {
					return noPruneList.indexOf(v.id) !== -1;
				});
				node.children.forEach(prune);
			}

			return node;
		}

		function getInstAndChildrenIds(instId) {
			var allIds = [instId];

			function getChildren(instId) {
				var inst = oneById(instId);
				if (inst.children && inst.children.length) {
					allIds = allIds.concat(inst.children);
					inst.children.forEach(getChildren);
				}
			}

			getChildren(instId);

			return allIds;
		}

		function getInstAndParentIds(instId) {
			var allIds = [instId];

			function addParent(instId) {
				var inst = oneById(instId);
				if (!angular.isNumber(inst.parent)) { return; }
				allIds.push(inst.parent);
				addParent(inst.parent);
			}

			addParent(instId);

			return allIds;
		}

		function getTreeData(filterObj) {
			if (filterObj == null) {
				filterObj = {key: 'name', value: ''};
			} else {
				_treeDataDefer = null;
			}

			if (_treeDataDefer == null) {
				_treeDataDefer = $q.defer();

				noPruneList = [];
				getInstitutions().then(function (data) {
					_treeDataDefer.resolve(prune(buildBranch(data[0], filterObj)));
				});
			}

			return _treeDataDefer.promise;
		}

		function oneById(id) {
			// use the lookup table to get a direct hit
			return angular.copy(id != null && institutions[lookupTable[id]] || notFound);
		}

		function getMyInstitutions() {
			return institutions != null ? institutions.filter(function (v) { return v.isAvailable; }) : [];
		}

		function availableChildrenCnt(inst) {
			var cnt = 0;
			inst.children.forEach(function (v,i,a){
				var childInst = oneById(v);
				if (childInst.children.length > 0) {
					childInst.availableChildrenCnt = availableChildrenCnt(childInst);
				}
				if (childInst.isAvailable || childInst.availableChildrenCnt > 0) {
					cnt = cnt + 1;
				}
			});
			return cnt;
		}

		function showVisibilityCalculator(){
			var _defer = $q.defer();
			var dialog = ngDialog.open({
				template:'/global/modals/visibility-calculator.html',
				closeByDocument: false,
				closeByNavigation: true,
				showClose: false,
				className: 'ngdialog-theme-default visibility-calculator-popup',
				data: {
					header: strings['VisibilityCalculator.Dialog.Text'],
					buttons: [{
						title: strings['Close'],
						cls:'fl-button',
						loading: false,
						enabled: true,
						action: function(){
		                    ngDialog.close(dialog.id);
		                    return _defer.resolve();
						}
					}]
				}
			});
			return _defer.promise;
		}

		return {
			ready: _defer.promise,
			getInstitutions: getInstitutions,
			oneById: oneById,
			getTreeData: getTreeData,
			getInstAndChildrenIds: getInstAndChildrenIds,
			getInstAndParentIds: getInstAndParentIds,
			getMyInstitutions: getMyInstitutions,
			showVisibilityCalculator: showVisibilityCalculator
		};

	});
	// #--- END Service (institutionSvc) ---# //
	// #------------------------------------# //

}());
