'use strict';

define(['indexApp', 'underscore', 'Extend', 'common/util', 'model/questionDetailModel', 'service/baseService'], function (app, _, Extend, util, Model) {
  app.controller('questionDetailCtrl', ['$scope', '$http', 'signValid', function ($scope, $http, signValid) {
    signValid.ValidAccess("#/questionDetail");                       //缓存登录验证
    //导航栏样式
    $('.nav li:eq(4)').addClass('active').siblings().removeClass('active');

    var ServerUrls = {
      PreviewInit: 'Questionnaire/{0}/Detail',                      // 获取问卷 输入：Id：问卷Id 输出：输出问卷 [ Questionnaire/{ID}/Detail ]
      QuestionList: 'Questionnaire/ResultDetail',                   // 查询问卷URL [ Questionnaire/ResultDetail/{sort}/{keyword} ]
      StopQuestion: 'Questionnaire/{0}/Enable/{1}',                 // 停用问卷URL [ Questionnaire/{id}/Enable/{isEnabled} ]
      DeleteQuestion: 'Questionnaire/{0}',                          // 删除问卷URL    [ Questionnaire/{id} Delete ]
      EditQuestion: 'Questionnaire/Update'                          // 编辑问卷信息URL   [ Questionnaire PUT ]
    };

    // Bussiness Logic
    $scope.vm = {
      DialogCollection: {
        //Carousel: {
        //    Start: function () {
        //        $('#myCarousel').carousel(0);
        //    },
        //    Pause: function () {
        //        $('#myCarousel').carousel('pause');
        //    }
        //},
        Edit: {
          Show: function () {
            $('#qsnaire').modal('show');
          },
          Hide: function () {
            $('#qsnaire').modal('hide');
          },
          Toggle: function () {
            $('#qsnaire').modal('toggle');
          }
        },
        Stop: {
          Show: function () {
            $('#prompt').modal('show');
          },
          Hide: function () {
            $('#prompt').modal('hide');
          },
          Toggle: function () {
            $('#prompt').modal('toggle');
          }
        },
        Preview: {
          Show: function () {
            $('#preview').modal('show');
          },
          Hide: function () {
            $('#preview').modal('hide');
          },
          Toggle: function () {
            $('#preview').modal('toggle');
          }
        },
        Delete: {
          Show: function () {
            $('#delete').modal('show');
          },
          Hide: function () {
            $('#delete').modal('hide');
          },
          Toggle: function () {
            $('#delete').modal('toggle');
          }
        },
        ReviseHeight: function () {
          $('.form-tabletd').css('height', $(window).height() - 280);
        }
      },
      searchCollection: {                         // 1. 查询原型
        params: {                               // 1.1 问卷查询标题
          questionName: ''
        },
        _validSearch: function () {             // 1.2 验证查询问卷条件
          var self = $scope.vm.searchCollection;
          //if (!self.params.questionName) {
          //    util.showFade("请录入您要查询的问卷名称！");
          //    return false;
          //}
          return true;
        },
        GetQuestionList: function () {          // 1.3 获取问卷结果集
          var question = $scope.vm.questionCollection,
            params = $scope.vm.searchCollection.params,
            url = ServerUrls.QuestionList,
            data = {
              sort: true,
              keyword: params.questionName
            };
          //console.log(data);
          util.ajaxPost($http, url, data, function (result) {

            if (result.state == 1) {
              var model = new Model();
              question.data = [];
              question.count = result.Data.length;
              if (question.count === 0) { util.showFade("没有找到相关的数据！"); } else {
                for (var i = 0; i < question.count; i++) {
                  var current = result.Data[i],
                    item = model.convertFromQuestion(current);
                  question.data.push(item);
                }
              }
              //console.log(question.data);
            }
            else { util.showFade(result.message); }
          }, function (err) { util.showFade(err); });
        },
        OnClickSearchQuestion: function () {    // 1.4 查询获取问卷结果集
          var self = $scope.vm.searchCollection;
          if (self._validSearch()) { self.GetQuestionList(); }
        },
      },
      sortCollection: {                           // 2. 排序原型
        data: [{ text: '从新到旧', value: 'desc' }, { text: '从旧到新', value: 'asc' }],
        count: 2,
        selectItem: 'asc',
        OnSort: function () {                   // 2.1 排序方法
          var self = $scope.vm.sortCollection,
            question = $scope.vm.questionCollection;
          question.data = _.sortBy(question.data, function (element) { return self.selectItem == 'asc' ? element.id : -element.id; });
        }
      },
      questionCollection: {                       // 3. 问卷列表原型
        data: [                // {question}
        ],
        count: 0,
        current: {                              // 3.1 当前编辑问卷{question}
          // id, // （编号）
          // name,//      （问卷名称）
          // code,//      （问卷编号）
          // desc//      （问卷说明）
        },
        OnChooseQestion: function (item) {      // 3.2 选择当前问卷
          var self = $scope.vm.questionCollection;
          _.extend(self.current, item);
        },
        OnClickEditSubject: function () {       // 3.3 编辑问卷信息
          var self = $scope.vm.questionCollection,
            editPanel = $scope.vm.DialogCollection.Edit,
            url = ServerUrls.EditQuestion,
            data = self.current;
          if (!data.name) {
            util.showFade('请录入问卷名称！');
            return false;
          }
          if (data.name.length > 30) {
            util.showFade('问卷名称不能超过30个字符！');
            return false;
          }
          if (data.code && data.code.length > 50) {
            util.showFade('问卷编码不能大于50个字符！');
            return;
          }
          if (data.desc && data.desc.length > 1000) {
            util.showFade('问卷说明不能大于1000个字符！');
            return;
          }
          var param = {
            id: data.id,
            name: data.name,
            code: data.code,
            description: data.desc
          };
          util.ajaxPost($http, url, param, function (result) {
            //console.log(result);
            if (result.state == 1) {
              // 更新List数据
              for (var i = 0; i < self.count; i++) {
                var item = self.data[i];
                if (item.id == self.current.id) {
                  item.name = self.current.name;
                  item.code = self.current.code;
                  item.desc = self.current.desc;
                  break;
                }
              }
              util.showFade('更新问卷成功！');
              // 关闭
              setTimeout(function () {
                editPanel.Hide();
              }, 1000);

            } else { util.showFade(result.message); }
          }, function (err) { util.showFade(err); });
        },
        OnClickStopQuestion: function () {      // 3.4 停用问卷
          var self = $scope.vm.questionCollection,
            stopPanel = $scope.vm.DialogCollection.Stop,
            url = String.prototype.format(ServerUrls.StopQuestion, self.current.id, false),
            data = {};

          util.ajaxPost($http, url, data, function (result) {
            //console.log(result);
            if (result.state == 1) {
              // 更新List数据
              for (var i = 0; i < self.count; i++) {
                var item = self.data[i];
                if (item.id == self.current.id) {
                  item.isPublic = true;
                  item.state = false;
                  break;
                }
              }
              util.showFade('停用问卷成功！');
              // 关闭
              setTimeout(function () {
                stopPanel.Hide();
              }, 1000);
            } else { util.showFade(result.message); }
          }, function (err) { util.showFade(err); });
        },
        OnClickDeleteQuestion: function () {    // 3.5 删除问卷
          var self = $scope.vm.questionCollection,
            deletePanel = $scope.vm.DialogCollection.Delete,
            url = String.prototype.format(ServerUrls.DeleteQuestion, self.current.id),
            data = {};

          util.ajaxPost($http, url, data, function (result) {
            //console.log(result);
            if (result.state == 1) {
              // 更新List数据
              var newData = [];
              for (var i = 0; i < self.count; i++) {
                var item = self.data[i];
                if (item.id != self.current.id) {
                  newData.push(item);
                }
              }
              self.data = newData;
              self.count = newData.length;

              util.showFade('删除问卷成功！');
              // 关闭
              setTimeout(function () {
                deletePanel.Hide();
              }, 1000);
            } else { util.showFade(result.message); }
          }, function (err) { util.showFade(err); });
        }
      },
      PreviewQuestion: {   // 预览问卷
        data: [],
        previewData: [],
        count: 0,
        previewCount: 0,
        currentItem: {},
        questionName: '',
        showQuestionBtn: false,
        No: 1,
        OnClickStart: function () {
          var self = $scope.vm.PreviewQuestion;
          //if (self.count > 0) {
          //    self.showQuestionBtn = true;
          //    var newItem = { selectAnswerItem: null };
          //    _.extend(newItem, self.data[0]);
          //    self.previewData.push(newItem);
          //    self.previewCount = 1;
          //    self.currentItem = newItem;
          //}
          self.previewData = [];
          self.previewCount = 0;
          self.No = 1;
          console.log(self.data);
          if (self.count > 0) {
            self.showQuestionBtn = true;
            self.previewCount = self.count;

            for (var i = 0; i < self.previewCount; i++) {
              var newItem = { selectAnswerItem: null, showQuestion: (i == 0) };
              _.extend(newItem, self.data[i]);
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
          //console.log(self.previewData);
          /// <summary>判断用户是否为第一个按钮</summary>
          if (!item._isTop) {
            item.showQuestion = false;
            for (var i = 0; i < item._index; i++) {
              var prevQuestion = self.previewData[i];
              if (prevQuestion.selectAnswerItem) {
                opData.push(prevQuestion);
              } else if (prevQuestion.isAnswer) {
                opData.push(prevQuestion);
              }
            }
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
            skipId = -1,
            isContain = false,
            nextIndex = -1;

          if (item.isAnswer || item.selectAnswerItem) {
            for (var i = 0; i < self.count; i++) {
              if (isContain) {
                var newItem = { selectAnswerItem: null };
                // 选择下一题
                if (skipId == -1) {
                  _.extend(newItem, self.data[i]);
                } else {
                  for (var j = 0; j < self.count; j++) {
                    if (self.data[j].id == skipId) {
                      _.extend(newItem, self.data[j]);
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
                  //console.log(newItem._index);
                  /// <summary>判断是否可以跳题</summary>
                  if (item.selectItem || item.selectAnswerItem || item.isAnswer) {
                    $scope.vm.PreviewQuestion.No += 1;
                    item.showQuestion = false;
                    self.previewData[newItem._index].showQuestion = true;
                  }
                }
                // 判断是否为最后一道题,设置为结果
                if (self.data[self.count - 1].id == newItem.id) {
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
              if (self.data[i].id == item.id) {
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
        SetPreviewData: function (item) {
          var qId = item.id || 0;
          if (qId > 0) {
            var self = $scope.vm.PreviewQuestion,
              question = $scope.vm.questionCollection,
              //carousel = $scope.vm.DialogCollection.Carousel,
              url = String.prototype.format(ServerUrls.PreviewInit, qId);

            _.extend(question.current, item);
            self.data = [];
            self.showQuestionBtn = false;
            //self.previewData = [];
            //carousel.Start();
            //carousel.Pause();

            util.ajaxGet($http, url, function (result) {
              //console.log(result);
              if (result.state == 1) {
                var entity = result.Data,
                  vm = new Model();

                self.count = entity.Questions.length;
                for (var i = 0; i < self.count; i++) {
                  var current = entity.Questions[i],
                    index = i,
                    isTop = (i === 0),
                    isBottom = (i == self.count - 1);
                  var item = vm.convertFromInitData(current, index, isTop, isBottom);
                  self.data.push(item);
                }
              }
              else { util.showFade(result.message); }
            }, function (err) { util.showFade(err); });
          }
        },
        Success: function () {
          util.showFade('预览成功！！');
        }
      },
      Init: function () {                         // 4. 初始化
        var search = $scope.vm.searchCollection;
        //carousel = $scope.vm.DialogCollection.Carousel;

        //carousel.Pause();
        search.GetQuestionList();
        $scope.vm.DialogCollection.ReviseHeight();
      }
    };

    $scope.vm.Init();

  }]);
  return app;
});

//// GET
//util.ajaxGet($http, url, function (result) {
//    if (result.state == 1) {
//        // ....
//    }
//    else util.showFade(result.message);
//}, function (err) { util.showFade(err); });
//// POST
//util.ajaxPost($http, url, data, function (result) {
//    if (result.state == 1) {
//        // ....
//    } else util.showFade(result.message);
//}, function (err) { util.showFade(err); });
