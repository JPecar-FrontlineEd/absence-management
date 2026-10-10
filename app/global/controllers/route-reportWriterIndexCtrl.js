(function () {
  "use strict";
  angular
    .module("aesop")
    .controller("ReportWriterIndexCtrl", function (
      $q,
      $scope,
      stringSvc,
      reportWriterApi,
      reportHelp,
      arrayHelp,
      permissionSvc,
      toastHelp,
      parseAesopDateFilter,
      urlHelp
    ) {
      // #-------------------------------------# //
      // #------- ReportWriterIndexCtrl -------# //

      // this is a route controller
      var route = this;
      var absenceTrendReportId = 38;

      // Get mnemonics that this view needs
      route.strings = stringSvc.getStrings([
        "ReportWriter",
        "Name",
        "Access",
        "All",
        "Public",
        "Published",
        "LockedForIntegration",
        "Created",
        "LastRun",
        "Runs",
        "Actions",
        "UseAsTemplate",
        "RunWithNewFilters",
        "RunWithSavedFilters",
        "NoRecordsFound",
        "by",
        "Report.AbsenceTrendAnalysis.ToolTip",
      ]);

      //Preset access level option
      var defaultAccessLevel = null;
      var permittedAccessLevels = 0;
      var canViewPublic = permissionSvc.iHave("RPTWACCESS.VIEWPUBLIC"),
        canViewPublished = permissionSvc.iHave("RPTWACCESS.VIEWPUBLISHED");
      if (canViewPublic && canViewPublished) {
        defaultAccessLevel = null;
        permittedAccessLevels = 2;
      } else if (canViewPublic) {
        defaultAccessLevel = 1;
        permittedAccessLevels = 1;
      } else if (canViewPublished) {
        defaultAccessLevel = 2;
        permittedAccessLevels = 1;
      }

      //Get default filter values from search params (force empty vals to null)
      var defaultFilters = urlHelp.getSearchParamOrDefaultValues(
        {
          presetDaySpan: 2,
          name: "",
          accessLevel: defaultAccessLevel,
        },
        ["accessLevel"]
      );

      // View Model properties
      route.vm = {
        isLoading: false,
        dataLoaded: false,
        filters: {
          presetDaySpan: defaultFilters["presetDaySpan"],
          showAllUsers: true,
          name: defaultFilters["name"],
        },
        columns: [
          {
            key: "name",
            width: "7/24",
            name: "Name",
            sortable: false,
            noTitle: true,
            template:
              '<a href="/abs-mgt/reports/report-writer/{{ row.id }}/view">{{ row.name }}</a>',
          },
          {
            key: "privacyLevel",
            width: "2/24",
            name: "Access",
            noTitle: true,
            sortable: false,
            template: "{{ row.accessLevel }}",
          },
          {
            key: "created",
            width: "4/24",
            name: "Created",
            noTitle: true,
            sortable: false,
            template: "{{ row.created }}" + "<div>{{ row.createdBy }}</div>",
          },
          {
            key: "lastExecution",
            width: "4/24",
            name: "LastRun",
            noTitle: true,
            sortable: false,
            template: "{{ row.lastExecution }}",
          },
          {
            key: "executionCount",
            width: "2/24",
            name: "Runs",
            sortable: false,
            noTitle: true,
            template: "{{ row.executionCount }}",
          },
          {
            key: "actions",
            width: "5/24",
            name: "Actions",
            noTitle: true,
            sortable: false,
            template:
              '<cmpt-reports-report-writer-actions report-config="row"></cmpt-reports-report-writer-actions>',
          },
        ],
        dataSet: [],
      };

      //Ensure "Access" filter options are displayed only if user can see more than 1
      //  Otherwise, we just pass the user's permitted accessLevel directly to api
      var filterOverride = {};
      if (permittedAccessLevels > 1) {
        route.vm.filters.accessLevel = defaultFilters["accessLevel"];
        route.vm.filters.accessLevels = [
          { value: null, title: "All", display: route.strings["All"] },
          { value: 1, title: "Public", display: route.strings["Public"] },
          { value: 2, title: "Published", display: route.strings["Published"] },
        ];
      } else {
        filterOverride.accessLevel = defaultAccessLevel;
      }

      function getCreatedBy(owner) {
        var name = owner.name !== null ? owner.name : "";
        if (name.length > 0) {
          name = route.strings["by"] + ": " + name;
        }
        return name;
      }

      function getAccessLevel(level) {
        var access = "";
        if (level === 1) {
          access = route.strings["Public"];
        } else if (level === 2) {
          access = route.strings["Published"];
        } else if (level === 3) {
          access = route.strings["LockedForIntegration"];
        }
        return access;
      }

      function processData(data) {
        var items = data.map(function (d) {
          d.lastExecution =
            d.lastExecution !== null
              ? parseAesopDateFilter(d.lastExecution, "short")
              : "";
          d.created = parseAesopDateFilter(d.created, "short");
          d.reportTypeOrder = d.type.order;
          d.createdBy = getCreatedBy(d.owner);
          d.accessLevel = getAccessLevel(d.privacyLevel);

          var returnUrl = urlHelp.getReturnUrl(
            "/abs-mgt/reports/report-writer/" + d.id + "/view/"
          );
          d.runWithNewFiltersUrl = urlHelp.getRwExecuteReportUrl(
            d,
            returnUrl,
            2
          );
          d.runWithSavedFiltersUrl = urlHelp.getRwExecuteReportUrl(
            d,
            returnUrl,
            1
          );
          d.editReportUrl = urlHelp.getRwExecuteReportUrl(d, returnUrl, 3);

          return d;
        });

        route.vm.dataSet = arrayHelp.group(
          items,
          "reportTypeOrder",
          "name",
          function (group) {
            group.title = group.items[0].type.description;
            if (group.items[0].type.order === absenceTrendReportId)
              group.isAbsenceTrendReport = true;
            return group;
          }
        );
      }

      // Actions that can be bound to from the view
      route.go = {
        search: function () {
          //Call api and load data
          toastHelp.clear();
          if (!route.vm.isLoading) {
            var _defer = $q.defer();
            route.vm.isLoading = true;
            var filter = reportHelp.convertReportWriterFilter(
              route.vm.filters,
              filterOverride
            );
            filter.fields =
              "id,name,lastExecution,created,owner,privacyLevel,executionCount," +
              "canEdit,canCreate,isOwner,tokenKey," +
              "type(description,order)";
            reportWriterApi.reports(filter).then(
              function (data) {
                processData(data);
                route.vm.isLoading = false;
                route.vm.dataLoaded = true;

                //Set filter values into search params
                urlHelp.setSearchParamValues(
                  defaultFilters,
                  route.vm.filters,
                  "id"
                );

                return _defer.resolve();
              },
              function (reasons) {
                route.vm.isLoading = false;
                toastHelp.error(reasons.$messages, "Error");
                return _defer.resolve();
              }
            );
            return _defer.promise;
          }
        },
      };

      // #----- END ReportWriterIndexCtrl -----# //
    });
})();
