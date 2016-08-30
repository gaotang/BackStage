define(['indexApp', 'underscore', 'jquery', 'common/util', 'Extend', 'common/const', 'sysConfig', 'common/BaseInfoManager', 'model/messageDeptListModel', 'model/messageAutoSendModel', 'directives/validateDirective', 'jQueryUi', 'timePicker', 'bootStrapMultiselect', 'service/baseService'],
  function (app, _, $, util, Extend, constant, sysConfig, BaseManager, MessageDeptListModel, AutoSendModel) {
    app.controller('messageCtrl', ['$scope', '$http', 'signValid', function ($scope, $http, signValid) {
        signValid.ValidAccess("#/message");                       //缓存登录验证
      //导航栏样式
      $(".nav li:eq(11)").addClass("active").siblings().removeClass("active");
      //图标
      $("#state").click(function () {
        $(".sidebar-nav").animate({ left: "0px" }, 500);
        $("#stop").removeClass("clickbtn");
        $("#state").attr("class", "clickbtn");
      });
      $("#stop").click(function () {
        $(".sidebar-nav").animate({ left: "-300px" }, 500);
        $("#state").removeClass("clickbtn");
        $("#stop").attr("class", "clickbtn");
      });
      //选项卡
      var aLi = $('#massageList .panel-body>span')
      var oBox = $('.tableup')
      for (var i = 0; i < 3; i++) {
        aLi[i].index = i;
        aLi[i].onclick = function () {
          for (var i = 0; i < 3; i++) {
            aLi[i].className = "";
            oBox[i].style.display = "none";
          }
          this.className = "clickspan";
          oBox[this.index].style.display = "block";
        }
      }
      /*  -------------------------------自动发送 Start-------------------------------  */
      $scope.AutoSend = {
        __IsSeachClick__: false,
        __OpenDialog__: function (panelDom) {
          panelDom && $('#' + panelDom).modal('show');
        },
        __CloseDialog__: function (panelDom) {
          panelDom && $('#' + panelDom).modal('hide');
        },
        __initTip__: function () {
          $('[data-toggle="tooltip"]').tooltip();
        },
        __initDates__: function () {
          var startDate = $('#autoSend_StartDate');                   /* AutoSend 开始时间 */
          var endDate = $('#autoSend_EndDate');                       /* AutoSend 结束时间 */
          $scope.AutoSend.__GetDateRange__(startDate, endDate);
          var planStartDate = $('#autoSend_Plan_StartDate');          /* AutoSend PlanDialog 开始时间 */
          var planEndDate = $('#autoSend_Plan_EndDate');              /* AutoSend PlanDialog 结束时间 */
          $scope.AutoSend.__GetDateRange__(planStartDate, planEndDate, {
            minDate: new Date()
          });
          var planDayTime = $('#autoSend_Plan_Time');                 /* AutoSend PlanDialog 每天重复 开始时间 */
          $scope.AutoSend.__GetTime__(planDayTime);
        },
        __FormatDate__: function (input) {                                  /* 格式化时间2015/02/12 => 2015-02-12 Start */
          if (input && input.indexOf('/') != -1) {
            return input.split('/').join('-');
          }
          return input || "";
        },                                /* 格式化时间2015/02/12 => 2015-02-12 End */
        __GetSMSCount__: function () {                                      /* 获取剩余可发短信状态 Start */
          var url = "Sms/GetSmsMargin";
          util.ajaxGet($http, url, function (result) {
            if (result.state == 1)
              $scope.AutoSend.SMSCount = result.Data;
            else util.showFade(result.message);
          }, function (err) { alert(err); });
        },                                    /* 获取剩余可发短信状态    End */
        __GetAutoSendList__: function () {                                  /* 自动发送的数据列表 Start */
          $scope.AutoSend.__GetAllDeptObj__(function (addedDeptList) {
            if (addedDeptList) {
              var setDefaultValue = function (value) {
                if (value === -1 || value === "-1" || value === undefined || value === null || value === "")
                  return "";
                return value;
              };
              var url = "Sms/GetSmsSended",
                serviceDeptID = ($scope.AutoSend.SelectDept.length == addedDeptList.length ? "" : $scope.AutoSend.SelectDept),
                start = $scope.AutoSend.__FormatDate__($scope.AutoSend.SelectStartDate),
                end = $scope.AutoSend.__FormatDate__($scope.AutoSend.SelectEndDate),
                data = {
                  smsSendedID: setDefaultValue($scope.AutoSend.SelectPlan),
                  serviceDeptID: (serviceDeptID || ""),
                  executionState: setDefaultValue($scope.AutoSend.SelectStatus),
                  start: start,
                  end: end
                };
              //console.log("-----------查询计划[查询条件]：-----------");
              //console.log(data);

              util.ajaxPost($http, url, data, function (result) {
                //console.log("-----------查询计划[查询结果]：-----------");
                //console.log(result);
                if (result.state == 1) {
                  var newList = [],
                    list = result.Data,
                    length = list.length;
                  if (length) {
                    for (var i = 0; i < length; i++) {
                      var item = list[i];
                      var model = new AutoSendModel();
                      model.convertFromPlansList(item, sysConfig.autoSend);
                      newList.push(model.PlansList);
                    }
                    $scope.AutoSend.List = newList;
                    //$scope.AutoSend.__initTip__();
                  } else {
                    $scope.AutoSend.List = [];
                    util.showFade("没有相关推广计划！");
                  }
                } else util.showFade(result.message);
              }, function (err) { alert(err); });
            }
          });
        },                                /* 自动发送的数据列表      End */
        __GetNotesTemplateList__: function () {                     /* 获取短信模板列表 Start */
          if (!$scope.AutoSend.Notes_List.length) {
            var url = "Sms/GetSmsTemplates";
            util.ajaxGet($http, url, function (result) {
              var list = [];
              for (var i = 0; i < result.Data.length; i++) {
                var item = result.Data[i];
                var model = new AutoSendModel();
                model.convertFromNotes(item);
                list.push(model.Notes);
              }
              $scope.AutoSend.Notes_List = list;
            }, function (err) { alert(err); });
          }
        },                           /* 获取短信模板列表        End */
        __GetDateRange__: function (startDateDom, endDateDom, options) {             /* 初始化开始和结果时间 Start */
          var opts = _.extend({
            changeMonth: true,
            buttonImageOnly: true,
            dateFormat: "yy/mm/dd",
            monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            dayNamesMin: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            minInterval: (1000 * 60 * 60 * 24 * 0), // 1 days
            onClose: function (dateText, inst) {
              if (inst) {
                if (inst.id == "autoSend_StartDate")
                  $scope.AutoSend.SelectStartDate = dateText;
                else if (inst.id == "autoSend_EndDate")
                  $scope.AutoSend.SelectEndDate = dateText;
                else if (inst.id == "autoSend_Plan_StartDate")
                  $scope.AutoSend.PlanDialog.StartDate = dateText;
                else if (inst.id == "autoSend_Plan_EndDate") {
                  $scope.AutoSend.PlanDialog.EndDate = dateText;

                  if (!!dateText) {
                    var now = new Date(),
                      year = now.getFullYear(),
                      month = now.getMonth() + 1,
                      day = now.getDate(),
                      hour = now.getHours(),
                      minute = now.getMinutes(),
                      dates = dateText.split('/');
                    if (dates[0] == year && dates[1] == month && dates[2] == day) {
                      /* AutoSend PlanDialog 每天重复 开始时间 */
                      minute += 5;
                      if (minute > 59) {
                        hour += 1;
                        minute -= 60;
                      }
                      $('#autoSend_Plan_Time').timepicker('option', 'hourMin', hour);
                      $('#autoSend_Plan_Time').timepicker('option', 'minuteMin', minute);
                    }
                  }

                }
              }
              $scope.$apply();
            }//,
            //onSelect: function (selectedDateTime) {
            //    //startDateTextBox.datetimepicker('option', 'maxDate', endDateTextBox.datetimepicker('getDate'));
            //}
          }, options || {});
          //console.log(opts);
          $.timepicker.dateRange(
            startDateDom,
            endDateDom,
            opts
          );
        },           /* 初始化开始和结果时间    End */
        __GetTime__: function (timeDom, options) {                                   /* 初始化时间 Start */
          var opts = _.extend({
            //hourMin: 8,
            //hourMax: 16
            timeOnlyTitle: '--请选择时间--',
            timeText: '时间',
            hourText: '时',
            minuteText: '分',
            secondText: '秒',
            currentText: '当前时间',
            closeText: '关闭',
            onClose: function (dateText, inst) {
              if (inst) {
                if (inst.id == "autoSend_Plan_Time")
                  $scope.AutoSend.PlanDialog.Time = dateText;

                $scope.$apply();
              }
              //console.log(dateText);
            }
          }, options || {});
          timeDom.timepicker(opts);
        },                                 /* 初始化开始和结果时间    End */
        __MultiSelect__: function (selectDom, data, options) {
          var opts = _.extend({
            selectAllText: "选择全部",
            allSelectedText: "全部选中",
            nSelectedText: "个被选中",
            nonSelectedText: "--全部--",
            buttonWidth: '181px',
            includeSelectAllOption: true,
            onChange: function (option, checked, select) {
              if (option.context) {
                var parent = $(option.context).parent();
                if (parent) {
                  var id = parent.attr("id");
                  if (id == "AutoSend_SelectDeptDDL") {
                    //console.log("-------------------------------------11111");
                    var all = $('#AutoSend_SelectDeptDDL').val();
                    $scope.AutoSend.SelectDept = all;
                    $scope.$apply();
                  } else if (id == "AutoSend_PlanDeptDDL") {
                    //console.log("-------------------------------------22222");
                    var all = $('#AutoSend_PlanDeptDDL').val() || "";
                    var dnStrs = [];
                    $('#AutoSend_PlanDeptDDL option').each(function () {
                      for (var i = 0; i < all.length; i++) {
                        if (all[i] == $(this).val()) {
                          dnStrs.push($(this).text());
                        }
                      }
                    });
                    //console.log(dnStrs);
                    $scope.AutoSend.PlanDialog.DeptName = all;
                    $scope.AutoSend.PlanDialog.DeptNameString = dnStrs.toString();
                    $scope.$apply();
                  }
                }
              }

              //var selectDeptId = $('#AutoSend_SelectDeptDDL').val(),
              //selectDeptId2 = $('#AutoSend_PlanDeptDDL').val();
              //console.log(selectDeptId);
              //console.log(selectDeptId2);
            }
          }, options || {});
          selectDom.multiselect(opts).multiselect('dataprovider', data);
        },
        __MultiSelectClear__: function (mSelectDom) {
          if (mSelectDom.length) {
            mSelectDom.find("option:selected").each(function () {
              $(this).prop('selected', false);
            })
            mSelectDom.multiselect('refresh');
          }
        },
        __GetSendPlanDDL__: function () {                                   /* 初始化推广计划下拉列表 Start */
          var url = "Sms/GetSmsSended",
            data = {
              smsSendedID: "",
              serviceDeptID: "",
              executionState: "",
              start: "",
              end: ""
            },
            list = [{
              value: -1,
              text: "--全部计划--"
            }];
          util.ajaxPost($http, url, data, function (result) {
            for (var i = 0; i < result.Data.length; i++) {
              var item = result.Data[i];
              var model = new AutoSendModel();
              model.convertFromPlansDDL(item);
              list.push(model.PlansDDL);
            }
            //console.log(result);
            $scope.AutoSend.PlanDDL = list;
          }, function (err) { alert(err); });
        },                                 /* 初始化推广计划下拉列表  End */
        __GetSendDeptDDL__: function () {                                   /* 初始化推广机构下拉列表 Start */
          $scope.AutoSend.__GetAllDeptObj__(function (list) {
            if (list) {
              var newList = [],//[{ label: "--全部--", title: "--全部--", selected: false, value: -1 }],
                length = list.length
              for (var i = 0; i < length; i++) {
                var item = list[i];
                var model = new AutoSendModel();
                model.convertFromPlansDeptDDL(item);
                newList.push(model.PlansDeptDDL);
              }
              var mSelect = $("#AutoSend_SelectDeptDDL");
              $scope.AutoSend.__MultiSelect__(mSelect, newList);
            }
          });
        },                                 /* 初始化推广机构下拉列表  End */
        __GetPlanDeptDDL__: function () {                                   /* 初始化推广机构[创建计划中的]下拉列表  Start */
          // enableDeptList 表示开启的机构
          $scope.AutoSend.__GetAllDeptObj__(function (list) {
            if (list) {
              //console.log(list)
              var newList = [],//[{ label: "--全部--", title: "--全部--", selected: false, value: -1 }],
                length = list.length
              for (var i = 0; i < length; i++) {
                var item = list[i];
                var model = new AutoSendModel();
                model.convertFromPlansDeptDDL(item);
                newList.push(model.PlansDeptDDL);
              }
              var mSelect = $("#AutoSend_PlanDeptDDL");
              $scope.AutoSend.__MultiSelect__(mSelect, newList, {
                nonSelectedText: "请选择相关机构",
              });
            }
          }, "enableDeptList");
        },                                 /* 初始化推广机构[创建计划中的]下拉列表  End */
        __GetSendStatusDDL__: function () {                                 /* 初始化执行状态下拉列表 Start */
          $scope.AutoSend.StatusDDL = constant.AutoSendExecTypes;
        },                               /* 初始化执行状态下拉列表  End */
        __GetAllDeptObj__: function (callback, deptName) {                  //
          deptName = deptName || "addedDeptList";
          var allDepts = BaseManager.DeptInfoManager.GetDeptInfo();
          callback && callback(allDepts[deptName]);
          //if (!allDepts) {
          //    setTimeout(function () {
          //        if (allDepts) {
          //            callback && callback(allDepts[deptName]);
          //        } else {
          //            callback && callback([{ label: "--全部--", title: "--全部--", selected: false, value: -1 }]);
          //        }

          //    }, 2000);
          //} else {
          //    callback && callback(allDepts[deptName]);
          //}
          //callback && callback(allDepts[deptName]);
          //console.log("----------------------获取机构：------------------------");
          //console.log(allDepts);
        },
        SMSCount: 0,                                           /* 剩余短信条数 */
        List: [],                                              /* AutoSend 列表 */
        Notes_List: [],                                        /* AutoSend 短信模板列表 */
        PlanDDL: [{
          value: -1,
          text: "--全部计划--"
        }],                                                    /* AutoSend 推广计划 DropDownList */
        SelectPlan: -1,                                        /* AutoSend 推广计划 DropDownList Selected[value] */
        DeptDDL: [],                                           /* AutoSend 推送机构 DropDownList */
        SelectDept: [],                                        /* AutoSend 推送机构 DropDownList Selected[value] */
        StatusDDL: [],                                         /* AutoSend 执行状态 DropDownList */
        SelectStatus: -1,                                      /* AutoSend 执行状态 DropDownList Selected[value] */
        SelectStartDate: "",                                   /* AutoSend 执行状态 DateTime Selected[value] */
        SelectEndDate: "",                                     /* AutoSend 执行状态 DateTime Selected[value] */
        SelectPlanId: -1,                                      /* 选中的计划ID */
        PlanDialog: {
          Id: 0,
          OperateId: 0,
          Name: "",
          Content: "",
          DeptName: [],
          //DeptNameString: "",
          StartDate: "",
          EndDate: "",
          Time: ""
        },
        NoteDialog: {
          Id: 0,
          Content: ""
        },
        Init: function () {
          $scope.AutoSend.__initDates__();                                        /* AutoSend 所有时间[初始化] */
          $scope.AutoSend.__GetSMSCount__();
          $scope.AutoSend.__GetNotesTemplateList__();                             /* AutoSend 短信模板[初始化] */
          $scope.AutoSend.__GetSendPlanDDL__();                                   /* AutoSend 推广计划[初始化] */
          $scope.AutoSend.__GetSendStatusDDL__();                                 /* AutoSend 执行状态[初始化] */
          //$scope.AutoSend.__GetSendDeptDDL__();                                   /* AutoSend 推送机构[初始化] */
          //$scope.AutoSend.__GetPlanDeptDDL__();                                   /* AutoSend 创建计划中的推送机构[初始化] */
        },
        OnSearchClick: function () {                           /* AutoSend 查询按钮 事件 */
          $scope.AutoSend.__IsSeachClick__ = true;
          $scope.AutoSend.__GetAutoSendList__();
        },
        OnSearchResetClick: function () {
          //$('#AutoSend_SelectDeptDDL option:selected').each(function () {
          //    $(this).prop('selected', false);
          //})
          //$('#AutoSend_SelectDeptDDL').multiselect('refresh');
          $scope.AutoSend.__MultiSelectClear__($('#AutoSend_SelectDeptDDL'));
          _.extend($scope.AutoSend, {
            SelectPlan: -1,         // 推广计划
            //SelectDept: [],       // 选中部门
            SelectStatus: -1,       // 执行状态
            SelectStartDate: "",    // 开始日期
            SelectEndDate: "",       // 结束日期
            SelectDept: []
          });
          $("#autoSend_StartDate").timepicker('option', 'maxDate', new Date(2099, 1, 1, 1, 1, 1));
          $("#autoSend_EndDate").timepicker('option', 'minDate', new Date());
        },
        PlanDialog_Reset: function () {
          //$('#AutoSend_PlanDeptDDL option:selected').each(function () {
          //    $(this).prop('selected', false);
          //})
          //$('#AutoSend_PlanDeptDDL').multiselect('refresh');
          $scope.AutoSend.__MultiSelectClear__($('#AutoSend_PlanDeptDDL'));
          _.extend($scope.AutoSend.PlanDialog, {
            Id: 0,
            Name: "",
            Content: "",
            DeptName: [],
            StartDate: "",
            EndDate: "",
            Time: ""
          });

          //$("#autoSend_Plan_StartDate,#autoSend_Plan_EndDate").val("");
          //$.timepicker.dateRange(
          //    $("#autoSend_Plan_EndDate"),
          //    $("#autoSend_Plan_StartDate"),
          //    {}
          //);
          $("#autoSend_Plan_StartDate").timepicker('option', 'maxDate', new Date(2099, 1, 1, 1, 1, 1));
          $("#autoSend_Plan_EndDate").timepicker('option', 'minDate', new Date());
        },
        PlanDialog_OnSaveClick: function () {                  /* PlanDialog Save 事件 */
          //console.log($scope.AutoSend.SelectDept);
          if (!$scope.AutoSend.PlanDialog.Name) {
            util.showFade("计划名称不能为空！");
            return;
          }
          if (!$scope.AutoSend.PlanDialog.Content) {
            util.showFade("计划内容不能为空！");
            return;
          }
          var deptDLLVal = $("#AutoSend_PlanDeptDDL").val();
          if (!deptDLLVal) {
            util.showFade("请选择相关机构！");
            return;
          }
          if (!$scope.AutoSend.PlanDialog.StartDate) {
            util.showFade("计划开始日期不能为空！");
            return;
          }
          if (!$scope.AutoSend.PlanDialog.EndDate) {
            util.showFade("计划结束日期不能为空！");
            return;
          }
          if (!$scope.AutoSend.PlanDialog.Time) {
            util.showFade("计划重复时间不能为空！");
            return;
          }

          var userInfo = BaseManager.UserInfoManager.GetUserInfo();
          if (!userInfo) {
            util.showFade("获取当前人信息失败，请重试！");
            return;
          }
          var model = new AutoSendModel(),
            planEntity = $scope.AutoSend.PlanDialog,
            url = "Sms/AppendSmsPlan";
          // 设置当前人的编号
          $scope.AutoSend.__GetAllDeptObj__(function (list) {
            if (list) {
              //console.log("---------获取人员信息：----------")
              //console.log(userInfo);
              planEntity.OperateId = userInfo.Id;
              var data = model.convertFromPlansListToParam(planEntity, sysConfig.autoSend, list);
              // 验证用户是否全部选择相关部门
              //if (data.ServiceDeptIDs.length == list.length) data.ServiceDeptIDs = [];
              //console.log("----------------------创建执行计划---------------------------");
              //console.log(data);
              util.ajaxPost($http, url, data, function (result) {
                if (result.state == 1) {
                  if ($scope.AutoSend.__IsSeachClick__) {
                    $scope.AutoSend.OnSearchClick();
                  }
                  // 更新推广计划下拉列表
                  $scope.AutoSend.PlanDDL.splice(1, 0, {
                    value: result.Data,
                    text: planEntity.Name
                  });
                  $scope.AutoSend.PlanDialog_Reset();
                  $scope.AutoSend.__CloseDialog__("plan");
                }
                util.showFade(result.message);
              }, function (err) { alert(err); });
            }
          }, "enableDeptList");
        },
        PlanDialog_OnSaveTemplateClick: function () {          /* PlanDialog SaveTemplate 事件 */
          var template = $scope.AutoSend.PlanDialog.Content,
            url = "Sms/AppendSmsTemplate",
            data = {
              //Template: "\"" + template + "\""
              Template: template
            };
          // ********************************************模板是否要加引号************************************************************
          if (template) {
            util.ajaxPost($http, url, data, function (result) {
              if (result.state == 1) {
                $scope.AutoSend.Notes_List.unshift({
                  Id: result.Data, Content: template, Checked: false
                });
              }
              util.showFade(result.message);
            }, function (err) { alert(err); });
          } else util.showFade("请先录入你要创建 的模板！");
        },
        TemplateDialog_OnSaveTemplateClick: function () {      /* TemplateDialog SaveTemplate 事件 */
          if ($scope.AutoSend.Notes_List.length) {
            var templateId = $scope.AutoSend.NoteDialog.Id,
              //newList = [],
              list = $scope.AutoSend.Notes_List,
              length = list.length;
            if (templateId) {
              for (var i = 0; i < length; i++) {
                var item = list[i];
                if (item.Checked) {
                  //newList.push(item);
                  $scope.AutoSend.PlanDialog.Id = item.Id;
                  $scope.AutoSend.PlanDialog.Content = item.Content;
                  $scope.AutoSend.__CloseDialog__("notes");
                }
              }
            } else util.showFade("请选择您要使用的模板！");
          } else util.showFade("没有模板，请先创建模板！");
        },
        TemplateDialog_OnDeleteTemplateClick: function () {    /* TemplateDialog DeleteTemplate 事件 */
          var templateId = $scope.AutoSend.NoteDialog.Id,
            url = "Sms/DeleteSmsTemplate?smsTemplateID=" + templateId,
            data = {};
          if (templateId) {
            if (confirm("您确认要删除此模板吗？")) {
              util.ajaxPost($http, url, data, function (result) {
                if (result.state == 1) {
                  $scope.AutoSend.NoteDialog.Id = 0;
                  //$scope.AutoSend.__GetNotesTemplateList__();
                  $scope.AutoSend.Notes_List = _.reject($scope.AutoSend.Notes_List, function (item, index, items) {
                    return item.Id == templateId;
                  });
                }
                util.showFade(result.message);
              }, function (err) { alert(err); });
            }
          } else util.showFade("请选择你要删除的模板！");
        },
        EndingDialog_OnSaveClick: function () {                /* EndingDialog Save 事件 */
          var url = "Sms/StopSmsPlan?planID=" + $scope.AutoSend.SelectPlanId,
            data = {};
          util.ajaxPost($http, url, data, function (result) {
            //console.log(result);
            var list = $scope.AutoSend.List,
              length = list.length;
            for (var i = 0; i < length; i++) {
              if ($scope.AutoSend.SelectPlanId == list[i].Id) {
                $scope.AutoSend.List[i].Status = 0;
              }
            }
            util.showFade(result.message);
          }, function (err) { alert(err); });
        },
        OnNoteClick: function (item) {                          /* TemplateDialog CheckBox 事件 */
          var list = $scope.AutoSend.Notes_List,
            length = list.length;
          //console.log(list);
          if ($scope.AutoSend.NoteDialog.Id != item.Id) {
            for (var i = 0; i < length; i++) {
              if (item == list[i]) {
                list[i].Checked = !list[i].Checked;
                if (list[i].Checked)
                  $scope.AutoSend.NoteDialog.Id = list[i].Id;
              } else list[i].Checked = false;
            }
          }
        },
        OnPlanStopClick: function (id) {
          $scope.AutoSend.SelectPlanId = id;
        }
      };
      $scope.AutoSend.Init();

      /*  -------------------------------自动发送 End-------------------------------  */

      /********************获取机构信息****************/
      var getServiceDeptMethod = function () {
        var url = "ServiceDept/GetAllServiceDepts";
        var successCallback = function (result) {
          if (result.state == 1) {
            var serviceDeptLists = [];
            //console.log(result.Data);
            for (var i = 0; i < result.Data.length; i++) {
              var item = result.Data[i];
              var model = new MessageDeptListModel();
              model.convertFrom(item);
              serviceDeptLists.push(model);
            }
            var callbackHandlerList = [
              $scope.AutoSend.__GetSendDeptDDL__,                                   /* AutoSend 推送机构[初始化] */
              $scope.AutoSend.__GetPlanDeptDDL__,                                   /* AutoSend 创建计划中的推送机构[初始化] */
              function () {
                $scope.deptListInfo = BaseManager.DeptInfoManager.GetDeptInfo();
              }
            ]
            BaseManager.DeptInfoManager.SetDeptInfo(serviceDeptLists, callbackHandlerList);
          }
        }
        var errorCallback = function (error) {
        }
        util.ajaxGet($http, url, successCallback, errorCallback);
      }
      if (!BaseManager.DeptInfoManager.Exist()) {
        getServiceDeptMethod();
      } else {
        $scope.deptListInfo = BaseManager.DeptInfoManager.GetDeptInfo();
        // 获取机构
        $scope.AutoSend.__GetSendDeptDDL__();                                   /* AutoSend 推送机构[初始化] */
        $scope.AutoSend.__GetPlanDeptDDL__();                                   /* AutoSend 创建计划中的推送机构[初始化] */
      }

      /***************添加机构********************/
      $scope.addDept = function () {
        $scope.optionDeptList = [{ Name: "请选择机构", Id: -1 }];
        for (var i = 0; i < $scope.deptListInfo.defaultDeptList.length; i++) {
          $scope.optionDeptList.push({
            Name: $scope.deptListInfo.defaultDeptList[i].Name, Id:
            $scope.deptListInfo.defaultDeptList[i].Id
          });
        }
        $scope.optionDeptList.Id = -1;
      }
      /************************添加机构保存***********************/
      $scope.addDeptCommit = function () {
        if ($scope.optionDeptList.Id == -1) {
          util.showFade("请选择要添加的机构");
          return;
        }
        var IsSendSmsEnabled = function () {
          var url = "ServiceDept/SetServiceDeptSendSmsEnabeld?serviceDeptID=" + $scope.optionDeptList.Id + "&isSendSmsEnabeld=" + true
          var data = {};
          var successCallback = function (result) {
            if (result.state == 1) {
              getServiceDeptMethod();
              $("#messageAdd").modal("hide");
              util.showFade(result.message);
            }
          }
          var errorCallback = function (error) {
          }
          util.ajaxPost($http, url, data, successCallback, errorCallback);
        }
        var url = "ServiceDept/SetServiceDeptSendSms?serviceDeptID=" + $scope.optionDeptList.Id + "&sendSms=" + true;
        var data = {};
        var successCallback = function (result) {
          if (result.state == 1) {
            IsSendSmsEnabled();
          }
        }
        var errorCallback = function (error) {
        }
        util.ajaxPost($http, url, data, successCallback, errorCallback);
      }

      /*****************************禁用***************************/
      var curDisEnabeldId = [];
      $scope.disableDeptMethod = function (item) {
        curDisEnabeldId = item.Id;
      }
      $scope.disableDeptCommit = function () {
        // if (true){
        //     $("#except").modal("show");
        //     return;
        // }

        var url = "ServiceDept/SetServiceDeptSendSmsEnabeld?serviceDeptID=" + curDisEnabeldId + "&isSendSmsEnabeld=" + false;
        var data = {};
        var successCallback = function (result) {
          if (result.state == 1) {
            getServiceDeptMethod();
            util.showFade("禁用机构成功！");
          }
          else {
            $("#except").modal("show");
          }
        }
        var errorCallback = function (error) {

        }
        util.ajaxPost($http, url, data, successCallback, errorCallback);
      }

      /****************************启用*****************************/
      $scope.ableDeptMethod = function (item) {
        curDisEnabeldId = item.Id;
      }
      $scope.ableDeptCommit = function () {
        var url = "ServiceDept/SetServiceDeptSendSmsEnabeld?serviceDeptID=" + curDisEnabeldId + "&isSendSmsEnabeld=" + true;
        var data = {};
        var successCallback = function (result) {
          if (result.state == 1) {
            getServiceDeptMethod();
            util.showFade("启用机构成功!");
          }
        }
        var errorCallback = function (error) {
        }
        util.ajaxPost($http, url, data, successCallback, errorCallback);
      }
    }]);
    return app;
  })
