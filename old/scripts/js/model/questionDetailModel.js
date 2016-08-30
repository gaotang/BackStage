'use strict';

define([],function(){
	var viewModel = function(){
	    var self = this;

		self.convertFromQuestion = function (dataModel) {
		    var result = {
		        id: 0, 				// （编号）
		        name: '',			//      （问卷名称）
		        code: '',			//      （问卷编号）
				desc: '',			//      （问卷说明）
		        type: 1,			//      （分类）
		        sendData: '',		//  （发送数据）
		        data: '',			//      （答卷数据）
		        createDate: '',		//（创建时间）
		        state: false,		//     （状态）
		        isPublic: false		//   （发布状态）        
		    };
		    result.id = dataModel.Id;
		    result.name = dataModel.Name;
		    result.code = dataModel.Code;
		    result.desc = dataModel.Description;
		    result.state = dataModel.IsEnabled;
		    result.createDate = dataModel.CreatedOn.split('T')[0];
		    result.isPublic = dataModel.IsPublished;
		    result.sendData = dataModel.SendedCount;
		    result.data = dataModel.FeedBackCount;

		    return result;
		};

	    // 初始化题日
		self.convertFromInitData = function (dataModel, index, isTop, isBottom) {
		    var items = [],
                itemsLength = dataModel.Items.length;


		    for (var j = 0; j < itemsLength; j++) {
		        var itemCurrent = dataModel.Items[j];
		        // 问卷选项
		        items.push({
		            id: itemCurrent.ID,
		            title: itemCurrent.Content,
		            score: (itemCurrent.Score || 0),
		            skipSubject: [],
		            isSkipSubject: false,
		            selectedClass: false,
		            isEnd: itemCurrent.IsDirectEnd,
		            selectedSkipSubjectId: (itemCurrent.SkipToQuestionId || -2)
		        });
		    }

		    var result = {
		        id: dataModel.ID, 						// （编号）
		        title: dataModel.Title,					// （题目标题）
		        code: dataModel.Code,					// （题目编号）
		        tip: dataModel.Tips,
		        type: dataModel.Type,
		        state: dataModel.IsEnabled,
		        isAnswer: (dataModel.CanSkip || false),	// （题目是否可以不答）
		        _index: index,							// （题目索引）
		        _isTop: isTop,							// （是否为第一题）
		        _isBottom: isBottom,					// （是否为最后一题）
		        answerCollection: {
		            data: items,
		            count: itemsLength
		        }
		    };

		    return result;
		};

	};
	return viewModel;
});