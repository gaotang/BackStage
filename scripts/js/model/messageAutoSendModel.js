define([], function () {
    var messageAutoSendModel = function () {
		var self = this;
		self.Notes = {              // 短信模板 ViewModel
		    Id: 0,
		    Content: "",
		    Checked: false
		};
		self.PlansDDL = {           // 推广计划 ViewModel
		    value: "",
		    //text: "",
		    label: "",
		    title: "",
		    selected: false
		};
		self.PlansDeptDDL = {       // 推送机构 ViewModel
		    value: "",
		    text: ""
		};
		self.PlansList = {          // 自动Send List ViewModel
            Id: 0,
		    Title: "",
		    Content: "",
		    DeptName: "",
		    StartDate: "",
		    EndDate: "",
		    ReWeek: "",
		    Status: 0
		};
		self.convertFromNotes = function (dataModel) {          // 短信模板
		    self.Notes.Id = dataModel.Id;
		    self.Notes.Content = dataModel.Content;
		    self.Notes.Checked = dataModel.Checked || false;
		};
		self.convertFromPlansDDL = function (dataModel) {       // 推广计划 DLL
		    self.PlansDDL.value = dataModel.ID;     //ID 全大写 数据来源
		    self.PlansDDL.text = dataModel.Theme;
		};
		self.convertFromPlansDeptDDL = function (dataModel) {   // 推送机构 DLL
		    self.PlansDeptDDL.value = dataModel.Id;
		    //self.PlansDeptDDL.text = dataModel.Name;
		    self.PlansDeptDDL.title = dataModel.Name;
		    self.PlansDeptDDL.label = dataModel.Name;
		    self.PlansDeptDDL.selected = false;
		    //label: 'Option 1', title: 'Option 1', value: '1', selected: true
		};
		self.convertFromPlansListToParam = function (planModel, sysConfig, depts) {
		    var ServiceDeptIDs = !planModel.DeptName ? "" : planModel.DeptName;
		    var Start = !planModel.StartDate ? "" : planModel.StartDate.split('/').join('-');
		    var End = !planModel.EndDate ? "" : planModel.EndDate.split('/').join('-');
		    var isTime = planModel.Time.indexOf(':') == -1;
		    var Hour = isTime ? planModel.Time : planModel.Time.split(':')[0];
		    var Minute = isTime ? 0 : planModel.Time.split(':')[1];
		    // 发送内容中 添加进入APP的链接
		    //http://hzswvajgs01:100/SMSPromotion.html#/1/1/bjbr002/1
		    var ext = sysConfig["EXT"]["default"];
		    var date = sysConfig["DATE"]["default"];
		    if (ServiceDeptIDs.length == 1) {       // 判断用户是否只选择一条记录
		        for (var i = 0; i < depts.length; i++) {
		            if (depts[i].Id == ServiceDeptIDs[0]) {
		                if (!!depts[i].DeptKey) {
		                    if (sysConfig["EXT"][depts[i].DeptKey]) {
		                        ext = sysConfig["EXT"][depts[i].DeptKey];
		                    }
		                    if (sysConfig["DATE"][depts[i].DeptKey]) {
		                        date = sysConfig["DATE"][depts[i].DeptKey];
		                    }
		                }
		                break;
		            }
		        }
		    }
		    //console.log("--机构信息--");
		    //console.log(depts);
		    //console.log(ServiceDeptIDs);
		    //console.log(ext);

		    var Content = date + planModel.Content + sysConfig["TIP"] + "[CDATA[" + sysConfig.GetURL() + "/{task}/{mobile}/{org}]]" + ext;
		    var data = {
		        Theme: planModel.Name,
		        Template: Content,
		        OperateType: 1,       // 0. 健管师  1.运维
		        OperateId: planModel.OperateId,
		        ServiceDeptIDs: ServiceDeptIDs,
		        //DeptNameString: planModel.DeptNameString,
		        IsAutoSend: true,
		        Start: Start,
		        End: End,
		        Hour: Hour,
		        Minute: Minute
		    };
		    //console.log("----------OperateId未处理，Template是否要加引号！-----------")
		    return data;
		};
		//self.convertFromPlansParamToEntity = function (planModel, Id) {
		//    var data = {
		//        Id: Id,
		//        Title: planModel.Theme,
		//        Content: planModel.Template,
		//        DeptName: planModel.DeptNameString,
		//        StartDate: planModel.Start,
		//        EndDate: planModel.End,
		//        ReWeek: (planModel.Hour + ":" + planModel.Minute),
		//        Status: 1
		//    };
		//    return data;
		//};
		self.convertFromPlansList = function (dataModel, sysConfig) {      // 自动Send List
		    //{ "Title": "A计划", "Content": "主题下的内容展示、主题下的内容展示。", "DeptName": "云南鑫湖医院", "StartDate": "2016-05-01", "EndDate": "2016-05-01", "ReWeek": "每天10：00", "Status": 1 },
		    var flag = sysConfig["TIP"] + "[CDATA[",
                startFlag = "]]",
		        Content = dataModel.Template.indexOf(flag) == -1 ? dataModel.Template : dataModel.Template.substr(0, dataModel.Template.indexOf(flag)),
		        reWeek = function (hour, minute) {
		            var _hourTag = hour > 9 ? "" : "0",
		                _minuteTag = minute > 9 ? "" : "0";
		            return _hourTag + hour + ":" + _minuteTag + minute;
		        };
		    //console.log(Content.indexOf(startFlag))
		    Content = Content.indexOf(startFlag) == -1 ? Content : Content.substr(Content.indexOf(startFlag) + startFlag.length, Content.length);
		    //console.log(Content.indexOf(startFlag))
		    //console.log(Content)
		    //console.log("-----------------------------")
		    self.PlansList.Id = dataModel.ID;
		    self.PlansList.Title = dataModel.Theme;
		    self.PlansList.Content = Content;
		    self.PlansList.DeptName = dataModel.DeptNames.toString();
		    self.PlansList.StartDate = dataModel.AutoSendStart;
		    self.PlansList.EndDate = dataModel.AutoSendEnd;
		    self.PlansList.ReWeek = reWeek(dataModel.Hour, dataModel.Minute);
		    self.PlansList.Status = dataModel.ExecutionState;
		};
	}
    return messageAutoSendModel;
})