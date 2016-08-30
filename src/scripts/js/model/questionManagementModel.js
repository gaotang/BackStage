'use strict';

define([], function () {
    var viewModel = function () {
        var self = this;

        // 初始化题日
        self.convertFromInitData = function (dataModel, index, isTop, isBottom) {
            var items = [],
                itemsLength = dataModel.Items.length,
                formatSelectSkipSubjectId = function (item) {
                    if (item.IsDirectEnd) {
                        return -1;
                    } else {
                        return (item.SkipToQuestionId || -2);
                    }
                };

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
                    selectedSkipSubjectId: formatSelectSkipSubjectId(itemCurrent)
                });
            }

            var result = {
                id: dataModel.ID,                       // （编号）
                title: dataModel.Title,                 // （题目标题）
                code: dataModel.Code,                   // （题目编号）
                tip: dataModel.Tips,
                type: dataModel.Type,
                state: dataModel.IsEnabled,
                isAnswer: (dataModel.CanSkip || false), // （题目是否可以不答）
                _index: index,                          // （题目索引）
                _isTop: isTop,                          // （是否为第一题）
                _isBottom: isBottom,                    // （是否为最后一题）
                answerCollection: {
                    data: items,
                    count: itemsLength
                }
            };

            return result;
        };

        // 下拉选择项中的选择的题目
        self.convertFromSearchData = function (dataModel, index, isTop, isBottom) {
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
                id: dataModel.ID,
                title: dataModel.Title,
                code: dataModel.Code,
                tip: dataModel.Tips,
                type: dataModel.Type,
                state: dataModel.IsEnabled,
                checked: false,
                isAnswer: (dataModel.CanSkip || false), // （题目是否可以不答）
                _index: index,                          // （题目索引）
                _isTop: isTop,                          // （是否为第一题）
                _isBottom: isBottom,                    // （是否为最后一题）
                answerCollection: {
                    data: items,
                    count: itemsLength
                }
            };

            return result;
        };

        // 设置可以跳选的题目列表信息
        self.setAnswerSkipSubject = function (dataList) {
            var length = dataList.length;
            if (length) {
                for (var x = 0; x < length; x++) {
                    var itemX = dataList[x],
                        isOk = false,
                        skipSubject = [{
                            id: -2,
                            title: '--\u8BF7\u9009\u62E9\u9898\u76EE--'     // --请选择题目--
                        }],
                        answers = itemX.answerCollection.data,
                        answerLength = itemX.answerCollection.count;
                    if (itemX.type == 1) {
                        for (var y = 0; y < length; y++) {
                            var itemY = dataList[y];
                            if (isOk) {
                                skipSubject.push({
                                    id: itemY.id,
                                    title: y+1
                                });
                            }
                            if (itemX.id == itemY.id) {
                                isOk = true;
                            }
                        }
                    }
                    skipSubject.push({
                        id: -1,
                        title: '\u7ED3\u675F'   // 结束
                    });
                    for (var i = 0; i < answerLength; i++) {
                        answers[i].skipSubject = skipSubject;
                    }
                }
            }
            //console.log(dataList);
            return dataList;
        };

        // 设置添加问卷题目的参数
        self.setSubmitSubjectParams = function (id, dataList) {
            var questions = [],
                length = dataList.length,
                    formatSkipSubject = function (key) {
                        if (!isNaN(key)) {
                            if (parseInt(key) > 0) { return key; }
                        }
                        return null;
                    };

            for (var i = 0; i < length; i++) {
                var current = dataList[i],
                    answerLength = current.answerCollection.count,
                    item = {
                        ID: current.id,
                        CanSkip: current.isAnswer,
                        Items: []
                    };
                for (var j = 0; j < answerLength; j++) {
                    var answer = current.answerCollection.data[j],
                        answerItem = {
                            ID: answer.id,
                            SkipToQuestionId: formatSkipSubject(answer.selectedSkipSubjectId),
                            Score: answer.score,
                            IsDirectEnd: (answer.selectedSkipSubjectId == -1)     // answer.isEnd
                        };
                    item.Items.push(answerItem);
                }
                questions.push(item);
            }

            var result = {
                ID: id,
                Questions: questions
            };
            return result;
        };

    };
    return viewModel;
});