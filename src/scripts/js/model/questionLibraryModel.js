'use strict';

define([], function () {
    var viewModel = function () {
        var self = this;
        
        self.SubjectItem = {
                 id:0,                      // （编号）
                 title:'',
                 code:'',
                 tip:'',
                 type:1,
                 state: false,
                 answerCollection: {        // 答案列表
                     data: [                // {answer}
                         //{
                         //    id: 0, // （编号）
                         //    title: '',
                         //    _index: 0,
                         //    _isTop: true,
                         //    _isBottom: false
                         //}
                     ],
                     count: 0
                 }
        };
        self.convertFromSubjectItem = function (dataModel) {
            var items = dataModel.Items,
                length = items.length,
                answers = [];
            for (var i = 0; i < length; i++) {
                answers.push({
                    id: items[i].ID,
                    title: items[i].Content,
                    _index: i,
                    _isTop: (i === 0),
                    _isBottom: (i == length - 1)
                });
            }

            self.SubjectItem = {
                id: dataModel.ID,               // （编号）
                title: dataModel.Title,
                code: dataModel.Code,
                tip: dataModel.Tips,
                type: dataModel.Type,
                state: dataModel.IsEnabled,
                answerCollection: {             // 答案列表
                    data: answers,
                    count: length
                }
            };

            return self.SubjectItem;
        };
    };
    return viewModel;
});