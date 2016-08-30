define([],function(){
	var phraseModel = function(){
		var self = this;
		self.Id;
		self.ItemName;
		self.ItemSpell;
		self.KeyWord;
		self.KetWordSpell;
		self.Content;
		self.CntSn;
		self.Descriptions;
		self.IsDefault;
		self.IsEnabled;
		self.IsDelete;
		self.CreatedBy;
		self.CreatedOn;
		self.ModifiedBy;
		self.ModifiedOn;
		self.Version;
		self.Guid;
		self.convertFrom = function(dataModel){
			self.Id = dataModel.Id;
			self.ItemName = dataModel.ItemName;
			self.ItemSpell = dataModel.ItemSpell ;
			self.KeyWord = dataModel.KeyWord;
			self.KetWordSpell = dataModel.KetWordSpell;
			self.Content = dataModel.Content;
			self.CntSn = dataModel.CntSn;
			self.Descriptions = dataModel.Descriptions;
			self.IsDefault = dataModel.IsDefault;
			self.IsEnabled = dataModel.IsEnabled;
			self.IsDelete = dataModel.IsDelete;
			self.CreatedBy = dataModel.CreatedBy;
			self.CreatedOn = dataModel.CreatedOn;
			self.ModifiedBy = dataModel.ModifiedBy;
			self.ModifiedOn = dataModel.ModifiedOn;
			self.Version = dataModel.Version;
			self.Guid = dataModel.Guid;
		}
	}
	return phraseModel;
	
})