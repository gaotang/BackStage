define(['Extend'],function(Extend){
	var groupRulesModel = function(){ 
		var self = this;
		self.CheckIndexCode;
		self.CreateOn;
		self.GroupID;
		self.GroupName;
		self.IsEnabled;
		self.LogicType;
		self.OrderNo;
		self.ResultFlagIDs;
		self.RuleDescription;
		self.RuleID;
		self.RuleItemID;
		self.RuleName;
		self.convertFrom = function(dataModel){
			self.CheckIndexCode = dataModel.CheckIndexCode;
			CreateDate = dataModel.CreateOn.ClearT();
			CreateDate = dataModel.CreateOn.ConvertToDate();
			self.CreateOn = CreateDate.Format("yyyy/MM/dd");
			self.GroupID = dataModel.GroupID;
			self.GroupName = dataModel.GroupName;
			self.IsEnabled = dataModel.IsEnabled;
			if (self.IsEnabled){
				self.IsEnabledText ="是";
			}
			else{
				self.IsEnabledText ="否";
			}
			 
			self.LogicType = dataModel.LogicType;
			self.OrderNo = dataModel.OrderNo;
			self.ResultFlagIDs = dataModel.ResultFlagIDs;
			self.RuleDescription = dataModel.RuleDescription;
			self.RuleID = dataModel.RuleID;
			self.RuleItemID = dataModel.RuleItemID;
			self.RuleName = dataModel.RuleName;
			}	
	}
	return groupRulesModel;
})