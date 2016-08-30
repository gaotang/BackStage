'use strict';

define(['indexApp', 'underscore', 'Extend', 'common/util', 'model/questionManagementModel'], function (app, _, Extend, util, ViewModel) {
  app.controller('questionManagementCtrl', ['$scope', '$http', '$routeParams', '$window', function ($scope, $http, $routeParams, $window) {
    //导航栏样式
    $('.nav li:eq(4)').addClass('active').siblings().removeClass('active');

    var ServerUrls = {
      Init: 'Questionnaire/{0}/Detail',                          // 获取问卷 输入：Id：问卷Id 输出：输出问卷 [ Questionnaire/{ID}/Detail ]
      Add: {          // 添加问卷相关的URL
        AddSubject: 'Questionnaire',                           // 添加问卷 输入：name：问卷名称，code;问卷编号，description:问卷描述 输出：保存问卷是否成功 [ Questionnaire/{name}/{code}/{description} ]
        UpdateSubject: 'Questionnaire/Update'
      },
      Edit: {         // 添加问卷题目的URL
        SearchSubject: 'Questions/{0}',                 // 根据code或者title搜素对应题目 [ Questions/{codetitle} ]
        SubmitSubject: 'Questionnaire/Questions'        // 编辑问卷 [ Questionnaire/Questions ]
      },
      Preview: {      // 预览问卷的URL
      },
      Public: {       // 发布问卷的URL
        UpdatePublicState: 'Questionnaire/{0}/Publish/true' // 设置问卷发布状态 输入：id：问卷Id，isPublished：问卷发布状态 [ Questionnaire/{id}/Publish/{isPublished} ]
      }
    };

    $scope.vm = {
      TabsCollection: {       // Tabs选择项
        currentPageIndex: 0,
        CurrentPage: function (index) {
          var self = $scope.vm.TabsCollection,
            question = $scope.vm.QuestionCollection,
            qId = (question.id || $routeParams.questionId);

          if (qId > 0) {
            self.currentPageIndex = index;
          } else if (index > 0) {
            util.showFade('请先添加问卷');
          }
        },
        Init: function () {
          var tabs = $scope.vm.TabsCollection,
            tabIndex = $routeParams.tabIndex || tabs.currentPageIndex;
          tabs.CurrentPage(tabIndex);
        }
      },
      DialogCollection: {
        //Carousel: {
        //    Start: function () {
        //        $('#myCarousel').carousel(0);
        //    },
        //    Pause: function () {
        //        $('#myCarousel').carousel('pause');
        //    }
        //},
        Collapse: {
          Show: function () {
            $('#collapseOne').collapse('show');
          },
          Hide: function () {
            $('#collapseOne').collapse('hide');
          },
          Toggle: function () {
            $('#collapseOne').collapse('toggle');
          }
        },
        Preview: {
          Show: function () {
            $('#prompt').modal('show');
          },
          Hide: function () {
            $('#prompt').modal('hide');
          },
          Toggle: function () {
            $('#prompt').modal('toggle');
          }
        }
      },
      QuestionCollection: {
        id: 0, // （编号）
        name: '',//      （问卷名称）
        code: '',//      （问卷编号）
        desc: '',//      （问卷说明）
        subjectCollection: {
          data: [      // {subject}
            //{
            //    id, // （编号）
            //    title,// （题目标题）
            //    code,// （题目编号）
            //    isAnswer,// （题目是否可以不答）
            //    _index,// （题目索引）
            //    _isTop,// （是否为第一题）
            //    _isBottom,// （是否为最后一题）
            //    answerCollection:{
            //        data:[  //{answer}
            //             //{
            //             //    id, // （编号）
            //             //    title,//  （答案标题）
            //             //    type,//  （答案类型）
            //             //    score,// （答案分数）
            //             //    skipSubject:[ //（是否可跳到的题目集合）{subject}
            //             //         {
            //             //             id, // （编号）
            //             //             title//  （答案标题）
            //             //             }
            //             //         // ...
            //             //    ],
            //             //    isSkipSubject:false, //是否选择跳题目录
            //             //   isEnd: false,
            //             //    selectedSkipSubjectId: 0
            //             //}
            //        ],
            //        count:0
            //    }
            //}
          ],
          count: 0
        },
        Init: function (questionId) {
          var qId = questionId || $routeParams.questionId;
          if (qId > 0) {
            var self = $scope.vm.EditQuestion,
              question = $scope.vm.QuestionCollection,
              subjects = self.subjectCollection,
              url = String.prototype.format(ServerUrls.Init, qId);
            util.ajaxGet($http, url, function (result) {
              //console.dir(result);
              if (result.state == 1) {
                var entity = result.Data,
                  vm = new ViewModel();

                question.subjectCollection.data = [];
                subjects.viewData = [];

                question.id = entity.Id;
                question.name = entity.Name;
                question.code = entity.Code;
                question.desc = entity.Description;
                question.subjectCollection.count = entity.Questions.length;
                subjects.viewCount = entity.Questions.length;

                for (var i = 0; i < question.subjectCollection.count; i++) {
                  var current = entity.Questions[i],
                    index = i,
                    isTop = (i === 0),
                    isBottom = (i == question.subjectCollection.count - 1);
                  var item = vm.convertFromInitData(current, index, isTop, isBottom);
                  //console.log(item);
                  question.subjectCollection.data.push(item);
                  subjects.viewData.push(item);
                }
                if (subjects.viewCount) { self.searchCollection.isShow = true; }
                subjects.viewData = vm.setAnswerSkipSubject(subjects.viewData); // 更新选择项下拉列表值
                //console.dir(subjects.viewData);

              }
              else {
                util.showFade(result.message);
              }
            }, function (err) { util.showFade(err); });
          }
        }
      },
      AddQuestion: {       // 添加问卷
        ValidQuestion: function () {  // 验证问卷信息
          var question = $scope.vm.QuestionCollection;
          if (!question.name) {
            util.showFade('请录入问卷名称！');
            return false;
          }
          if (question.name.length > 30) {
            util.showFade('问卷名称不能超过30个字符！');
            return false;
          }
          if (question.code && (question.code.length > 50)) {
            util.showFade('问卷编号不能超过50个字符！');
            return false;
          }
          if (question.desc && (question.desc.length > 1000)) {
            util.showFade('问卷说明不能超过1000个字符！');
            return false;
          }
          return true;
        },
        OnSubmit: function () {    // 添加问卷
          var self = $scope.vm.AddQuestion,
            tabs = $scope.vm.TabsCollection,
            question = $scope.vm.QuestionCollection,
            data = {
              name: question.name,
              code: question.code,
              description: question.desc,
            };
          if (self.ValidQuestion()) {
            util.ajaxPost($http, ServerUrls.Add.AddSubject, data, function (result) {
              if (result.state == 1) {
                // 更新ID
                question.id = result.Data;
                util.showFade('添加问卷基本信息成功！');
                // 跳转下一页面
                tabs.CurrentPage(1);

              } else { util.showFade(result.message); }
            }, function (err) { util.showFade(err); });
          }
        },
        OnEditSubmit: function () {
          var self = $scope.vm.AddQuestion,
            tabs = $scope.vm.TabsCollection,
            question = $scope.vm.QuestionCollection,
            data = {
              id: question.id,
              name: question.name,
              code: question.code,
              description: question.desc
            };

          if (self.ValidQuestion()) {
            util.ajaxPost($http, ServerUrls.Add.UpdateSubject, data, function (result) {
              if (result.state == 1) {
                util.showFade('编辑问卷基本信息成功！');
                // 跳转下一页面
                //console.log(tabs.currentPageIndex);
                tabs.CurrentPage(1);
              } else { util.showFade(result.message); }
            }, function (err) { util.showFade(err); });

          }
        }
      },
      EditQuestion: {      // 编辑问卷
        searchCollection: {
          isShow: false,
          params: {
            searchSearchSubjectByQuestionKey: '',
          },
          _validSearch: function () {                 // 1.2 题库查询验证
            var self = $scope.vm.EditQuestion.searchCollection;

            if (!self.params.searchSearchSubjectByQuestionKey) {
              util.showFade('请录入您要查询问卷名称或问卷编号！');
              return false;
            }
            return true;
          },
          GetQuestionList: function () {              // 1.3 获取题库结果集
            var self = $scope.vm.EditQuestion,
              params = self.searchCollection.params,
              subjects = self.subjectCollection,
              url = String.prototype.format(ServerUrls.Edit.SearchSubject, params.searchSearchSubjectByQuestionKey);

            util.ajaxGet($http, url, function (result) {
              //console.log(result);
              if (result.state == 1) {
                var vm = new ViewModel();
                subjects.queryData = [];
                subjects.queryCount = result.Data.length;
                if (subjects.queryCount === 0) { util.showFade("没有找到相关的数据！"); } else {
                  for (var i = 0; i < subjects.queryCount; i++) {
                    var current = result.Data[i],
                      index = i,
                      isTop = (i === 0),
                      isBottom = (i == subjects.queryCount - 1),
                      item = vm.convertFromSearchData(current, index, isTop, isBottom);
                    for (var j = 0; j < subjects.viewCount; j++) {
                      if (subjects.viewData[j].id == item.id) {
                        item.checked = true;
                      }
                    }
                    subjects.queryData.push(item);
                  }
                }
                //self.OnResetSkipSubject();
              }
              else { util.showFade(result.message); }
            }, function (err) { util.showFade(err); });
          },
          OnClickSearchSubject: function () {           // 1.4 题库查询操作
            var self = $scope.vm.EditQuestion.searchCollection,
              collapse = $scope.vm.DialogCollection.Collapse;

            if (self._validSearch()) {
              collapse.Show();
              self.GetQuestionList();

            }
          },
          OnClickChecked: function (item) {
            item.checked = !item.checked;
          },
          OnChooseSubject: function () {              // 1.5 用户选择相关的题目
            var self = $scope.vm.EditQuestion,
              collapse = $scope.vm.DialogCollection.Collapse,
              subjects = self.subjectCollection,
              index = 0,
              vm = new ViewModel(),
              delViewData = [],
              newViewData = [];

            // 验证下拉中是否有相关的选择项，没有就插入
            for (var i = 0; i < subjects.queryCount; i++) {
              var item = subjects.queryData[i];
              if (item.checked) {
                var isContain = false;
                for (var j = 0; j < subjects.viewCount; j++) {
                  if (subjects.viewData[j].id == item.id) {
                    isContain = true;
                  }
                }
                if (!isContain) {
                  subjects.viewData.push(item);
                  subjects.selectedQueryData.push(item);
                  index++;
                }
              } else { // 删除ViewData中没有选中的选择项
                for (var k = 0; k < subjects.viewCount; k++) {
                  if (subjects.viewData[k].id == item.id) {
                    delViewData.push(item);
                  }
                }
              }
            }
            for (var x = 0; x < subjects.viewData.length; x++) {
              var isDelete = false;
              for (var y = 0; y < delViewData.length; y++) {
                if (subjects.viewData[x].id == delViewData[y].id) {
                  isDelete = true;
                }
              }
              if (!isDelete) {
                newViewData.push(subjects.viewData[x]);
              }
            }
            subjects.viewData = vm.setAnswerSkipSubject(newViewData); // 更新选择项下拉列表值

            subjects.selectedQueryCount = subjects.selectedQueryData.length;
            subjects.viewCount = subjects.viewData.length;
            // 重排viewData
            for (var z = 0; z < subjects.viewData.length; z++) {
              subjects.viewData[z].index = z;
              subjects.viewData[z]._isTop = (z === 0);
              subjects.viewData[z]._isBottom = (z == subjects.viewData.length - 1);
            }

            if (subjects.viewCount) {
              self.searchCollection.isShow = true;
              self.OnResetSkipSubject();
            }
            collapse.Hide();

          }
        },
        subjectCollection: {
          viewData: [
            //                { // {subject}
            //                    id, // （编号）
            //                    title,// （题目标题）
            //                    code,// （题目编号）
            //                    isAnswer,// （题目是否可以不答）
            //                    _index,// （题目索引）
            //                    _isTop,// （是否为第一题）
            //                    _isBottom,// （是否为最后一题）
            //                    answerCollection:{
            //                        data:[  //{answer}
            //                            id, // （编号）
            //                            title,//  （答案标题）
            //                            type,//  （答案类型）
            //                            score,// （答案分数）
            //                            skipSubject:[ //（是否可跳到的题目集合）{subject}
            //                                 {
            //                                     id, // （编号）
            //                                     title//  （答案标题）
            //                                     }
            //                                // ...
            //                            ],
            //isSkipSubject:false, //是否选择跳题目录
            //selectedSkipSubject:{   // {subject}
            //    id, // （编号）
            //    title//  （答案标题）
            //}
          ],
          queryData: [],
          selectedQueryData: [// {subject}
          ],
          viewCount: 0,
          queryCount: 0,
          selectedQueryCount: 0
        },
        ValidScore: function (item) {
          if (!isNaN(item.score)) {
            item.score = parseInt(item.score);
          } else {
            var newScore = parseInt(item.score);
            if (!isNaN(newScore)) {
              item.score = newScore;
            } else { item.score = 0; }
          }
        },
        AddScore: function (item) {
          if (!isNaN(item.score)) {
            item.score = parseInt(item.score) + 1;
          } else {
            item.score = 0;
          }
        },
        SubScore: function (item) {
          if (!isNaN(item.score)) {
            if (item.score > 0) {
              item.score -= 1;
            }
          } else {
            item.score = 0;
          }
        },
        OnNext: function (item) {  // （平移到上一题）
          var self = $scope.vm.EditQuestion,
            subjects = self.subjectCollection,
            data = subjects.viewData,
            length = subjects.viewCount,
            index = -1;

          if (!item._isBottom) {
            for (var i = 0; i < length; i++) {
              if (data[i] == item) {
                index = i;
                break;
              }
            }
            if (index != -1) {
              data.splice(index, 2, data[index + 1], data[index]);
              for (var j = 0; j < length; j++) {
                data[j]._isTop = (j === 0);
                data[j]._index = j;
                data[j]._isBottom = (j == length - 1);
              }

              self.OnResetSkipSubject();
            }
          }
        },
        OnPrev: function (item) {  // （平移到下一题）
          var self = $scope.vm.EditQuestion,
            subjects = self.subjectCollection,
            data = subjects.viewData,
            length = subjects.viewCount,
            index = -1;

          if (!item._isTop) {
            for (var i = 0; i < length; i++) {
              if (data[i] == item) {
                index = i;
                break;
              }
            }
            if (index != -1) {
              data.splice(index - 1, 2, data[index], data[index - 1]);
              for (var j = 0; j < length; j++) {
                data[j]._isTop = (j === 0);
                data[j]._index = j;
                data[j]._isBottom = (j == length - 1);
              }

              self.OnResetSkipSubject();
            }
          }
        },
        OnTop: function (item) {  //  （平移到第一题）
          var self = $scope.vm.EditQuestion,
            subjects = self.subjectCollection,
            data = subjects.viewData,
            length = subjects.viewCount,
            index = -1,
            newSubjects = [item];

          if (!item._isTop) {
            for (var i = 0; i < length; i++) {
              if (data[i] == item) {
                index = i;
              } else {
                newSubjects.push(data[i]);
              }
            }
            if (index != -1) {
              for (var j = 0; j < length; j++) {
                newSubjects[j]._isTop = (j === 0);
                newSubjects[j]._index = j;
                newSubjects[j]._isBottom = (j == length - 1);
              }
              $scope.vm.EditQuestion.subjectCollection.viewData = newSubjects;

              self.OnResetSkipSubject();
            }
          }
        },
        OnBottom: function (item) {  // （平移到最后一题）
          var self = $scope.vm.EditQuestion,
            subjects = self.subjectCollection,
            data = subjects.viewData,
            length = subjects.viewCount,
            index = -1,
            newSubjects = [];

          if (!item._isBottom) {
            for (var i = 0; i < length; i++) {
              if (data[i] == item) {
                index = i;
              } else {
                newSubjects.push(data[i]);
              }
            }
            if (index != -1) {
              newSubjects.push(item);
              for (var j = 0; j < length; j++) {
                newSubjects[j]._isTop = (j === 0);
                newSubjects[j]._index = j;
                newSubjects[j]._isBottom = (j == length - 1);
              }
              $scope.vm.EditQuestion.subjectCollection.viewData = newSubjects;

              self.OnResetSkipSubject();
            }
          }
        },
        OnDeleteSelf: function (item) {  // （删除此题）
          var self = $scope.vm.EditQuestion,
            subjects = self.subjectCollection,
            data = subjects.viewData,
            length = subjects.viewCount;

          if (length > 2) {
            var newSubjects = [];
            for (var i = 0; i < length; i++) {
              if (data[i] != item) {
                newSubjects.push(data[i]);
              }
            }
            subjects.viewCount = newSubjects.length;
            for (var j = 0; j < self.count; j++) {
              newSubjects[j]._isTop = (j === 0);
              newSubjects[j]._index = j;
              newSubjects[j]._isBottom = (j == subjects.viewCount - 1);
            }
            // 必须为完整信息
            $scope.vm.EditQuestion.subjectCollection.viewData = newSubjects;

            self.OnResetSkipSubject();
          } else {
            util.showFade('问卷题目必须大于等于两项!');
          }
        },
        OnResetSkipSubject: function () { // 重置跳转的题目
          var self = $scope.vm.EditQuestion,
            subjects = self.subjectCollection,
            vm = new ViewModel();
          for (var i = 0; i < subjects.viewCount; i++) {
            var item = subjects.viewData[i],
              answers = item.answerCollection.data,
              answerLength = item.answerCollection.count;

            for (var j = 0; j < answerLength; j++) {
              answers[j].selectedSkipSubjectId = -2;
              answers[j].isEnd = false;
            }
          }
          //console.log(subjects.viewData)
          subjects.viewData = vm.setAnswerSkipSubject(subjects.viewData); // 更新选择项下拉列表值
          //console.log(subjects.viewData)
        },
        OnSubmit: function () {
          var tabs = $scope.vm.TabsCollection,
            question = $scope.vm.QuestionCollection,
            subjects = $scope.vm.EditQuestion.subjectCollection,
            url = ServerUrls.Edit.SubmitSubject,
            vm = new ViewModel(),
            data = vm.setSubmitSubjectParams(question.id, subjects.viewData);

          if (data.Questions.length < 2) {
            util.showFade('问卷题目最少要插入两项！');
          } else {
            //console.log(data);
            util.ajaxPost($http, url, data, function (result) {
              //console.log(result);
              if (result.state == 1) {
                util.showFade('保存问卷题目成功！');
                // 跳转下一页面

                //console.log(question);
                //debugger;
                question.Init(question.id);

                tabs.CurrentPage(2);

                //console.log(tabs.currentPageIndex);
              } else {
                util.showFade(result.message);
              }
            }, function (err) { util.showFade(err); });
          }

        }
      },
      PreviewQuestion: {   // 预览问卷
        previewData: [],
        previewCount: 0,
        currentItem: {},
        showQuestionBtn: false,
        No: 1,
        OnClickStart: function () {
          var self = $scope.vm.PreviewQuestion,
            subjects = $scope.vm.EditQuestion.subjectCollection;
          //console.log(subjects.viewData);
          self.previewData = [];
          self.previewCount = 0;
          if (subjects.viewCount > 0) {
            self.showQuestionBtn = true;
            self.previewCount = subjects.viewCount;
            $scope.vm.PreviewQuestion.No = 1;
            for (var i = 0; i < self.previewCount; i++) {
              subjects.viewData[i]._index = i;
            }
            for (var i = 0; i < self.previewCount; i++) {
              var newItem = { isSkip: false, selectAnswerItem: null, selectItem: undefined, showQuestion: (i == 0) };
              _.extend(newItem, subjects.viewData[i]);
              for (var j = 0; j < newItem.answerCollection.count; j++) {
                newItem.answerCollection.data[j].selectedClass = false;
              }
              self.previewData.push(newItem);
            }
          }
        },
        OnChooseAnswer: function (item, selectAnswer) {
          var self = $scope.vm.PreviewQuestion,
            list = item.answerCollection.data,
            length = item.answerCollection.count;

          //self.currentItem = item;
          if (item.type == 1) {
            for (var i = 0; i < length; i++) {
              list[i].selectedClass = (list[i] == selectAnswer);
            }
          } else {
            selectAnswer.selectedClass = !selectAnswer.selectedClass;
          }

          item.selectAnswerItem = selectAnswer;
          //console.log(self.previewData);
          // 判断用户选择的项是否有可结束项
          var selectItem = _.find(item.answerCollection.data, function (element) { return element.isEnd && element.selectedClass });
          var selectItemClass = _.find(item.answerCollection.data, function (element) { return element.selectedClass });
          //console.log(selectItemClass)
          if (selectItemClass === undefined) {
            item.selectAnswerItem = null;
          }
          item.selectItem = selectItem !== undefined;
        },
        OnChoosePrevAnswer: function (item) {
          //console.log(item);
          var self = $scope.vm.PreviewQuestion,
            answers = item.answerCollection.data,
            length = item.answerCollection.count,
            opData = [];
          //console.log(item);
          /// <summary>判断用户是否为第一个按钮</summary>
          if (!item._isTop) {
            item.showQuestion = false;
            for (var i = 0; i < item._index; i++) {
              var prevQuestion = self.previewData[i];
              if (prevQuestion.selectAnswerItem) {
                opData.push(prevQuestion);
              } else if (prevQuestion.isAnswer && self.previewData[item._index - 1].isSkip) {
                opData.push(prevQuestion);
              }
            }
            //console.log(opData);
            if (opData.length > 0) {
              opData[opData.length - 1].showQuestion = true;
            }
          }
          for (var i = 0; i < length; i++) {
            answers[i].selectedClass = false;
          }
          if ($scope.vm.PreviewQuestion.No > 1)
            $scope.vm.PreviewQuestion.No -= 1;
          item.selectAnswerItem = null;
          item.selectItem = undefined;
        },
        OnChooseNextAnswer: function (item) {               // 问卷预览开始测试
          var self = $scope.vm.PreviewQuestion,
            subjects = $scope.vm.EditQuestion.subjectCollection,
            skipId = -1,
            isContain = false,
            nextIndex = -1;

          item.isSkip = true;
          //console.log(item);
          if (item.isAnswer || item.selectAnswerItem) {
            for (var i = 0; i < subjects.viewCount; i++) {
              if (isContain) {
                var newItem = { selectAnswerItem: null };
                // 选择下一题
                if (skipId == -1) {
                  _.extend(newItem, subjects.viewData[i]);
                } else {
                  for (var j = 0; j < subjects.viewCount; j++) {
                    if (subjects.viewData[j].id == skipId) {
                      _.extend(newItem, subjects.viewData[j]);
                      break;
                    }
                  }
                }
                // 判断是否有下一题，没有就添加，有就更新一下题
                for (var x = 0; x < self.previewCount; x++) {
                  if (self.previewData[x].id == item.id) {
                    if (x != self.previewCount - 1) {
                      nextIndex = x + 1;
                      break;
                    }
                  }
                }
                /// <summary>判断用户是否为最后一按钮</summary>
                if (!item._isBottom) {
                  /// <summary>判断是否可以跳题</summary>
                  if (item.selectItem || item.selectAnswerItem || item.isAnswer) {
                    $scope.vm.PreviewQuestion.No += 1;
                    item.showQuestion = false;
                    self.previewData[newItem._index].showQuestion = true;
                  }
                }
                // 判断是否为最后一道题,设置为结果
                if (subjects.viewData[subjects.viewCount - 1].id == newItem.id) {
                  var lastAnswerCollection = self.previewData[self.previewCount - 1].answerCollection,
                    lastAnswer = lastAnswerCollection.data,
                    lastLength = lastAnswerCollection.count;
                  for (var y = 0; y < lastLength; y++) {
                    lastAnswer[y].isEnd = true;
                  }
                }
                break;
              }
              // 判断用户是否选择了答案，如果有跳题情况，则执行跳题的情况
              if (subjects.viewData[i].id == item.id) {
                if (item.selectAnswerItem) {
                  if (!isNaN(item.selectAnswerItem.selectedSkipSubjectId) && item.selectAnswerItem.selectedSkipSubjectId > 0) {
                    skipId = item.selectAnswerItem.selectedSkipSubjectId;
                  }
                  isContain = true;
                } else if (item.isAnswer) {
                  isContain = true;
                }
              }
            }
          } else {
            util.showFade('此题为必填，请录入你要选择的结果！');
          }
        },
        Success: function () {
          var self = $scope.vm.DialogCollection.Preview;
          //util.showFade('预览成功！！');
          self.Show();
        },
        SuccessOK: function () {
          var self = $scope.vm.PreviewQuestion;

          //// 重置答案选择项
          //for (var i = 0; i < self.previewCount; i++) {
          //    for (var j = 0; j < self.previewData[i].answerCollection.count; j++) {
          //        self.previewData[i].answerCollection.data[j].selectedClass = false;
          //    }
          //}
          self.showQuestionBtn = false;
          self.No = 1;
        }
      },
      PublicQuestion: {    // 发布问卷
        OnClickPublicQuestion: function () {  // 发布问卷
          var question = $scope.vm.QuestionCollection,
            url = String.prototype.format(ServerUrls.Public.UpdatePublicState, question.id),
            data = {};

          //console.log(url);
          util.ajaxPost($http, url, data, function (result) {
            if (result.state == 1) {
              util.showFade('发布问卷成功！');
              // 跳转下一页面
              setTimeout(function () {
                $window.location.href = '#questionDetail';
              }, 1000);
            } else { util.showFade(result.message); }
          }, function (err) { util.showFade(err); });
        }
      },
      Init: function () {   // 初始化
        var tabs = $scope.vm.TabsCollection,
          question = $scope.vm.QuestionCollection;
        tabs.Init();
        question.Init();
      }
    };


    $scope.$watch('vm.TabsCollection.currentPageIndex', function (newValue) {
      if (newValue == 2) {
        //console.log("清除预览");
        // 清除预览
        $scope.vm.PreviewQuestion.showQuestionBtn = false;
        for (var i = 0; i < $scope.vm.PreviewQuestion.previewCount; i++) {
          var item = $scope.vm.PreviewQuestion.previewData[i],
            length = item.answerCollection.count;
          $scope.vm.PreviewQuestion.previewData[i].selectAnswerItem = null;
          for (var j = 0; j < length; j++) {
            $scope.vm.PreviewQuestion.previewData[i].answerCollection.data[j].selectedClass = false;
          }
        }
      }
    });

    $scope.vm.Init();

  }]);
  return app;
});
