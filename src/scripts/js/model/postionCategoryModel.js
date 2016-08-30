define([],function(){
	var PostionCategoryModel=function(){
		var self = this;
		self.Code;
		self.Name;
		self.convertFrom=function(dataModel){
			self.Name=dataModel.Name;
			self.Code=parseInt(dataModel.Code);
		}
	}
	return PostionCategoryModel
})