'use strict';

define(['indexApp', 'underscore', 'Extend', 'common/util', 'model/questionLibraryModel', 'service/baseService'], function (app, _, Extend, util, ViewModel) {
  app.controller('questionLibraryCtrl', ['$scope', '$http', '$location', '$anchorScroll', 'signValid', function ($scope, $http, $location, $anchorScroll, signValid) {
    signValid.ValidAccess("#/questionLibrary");                       //缓存登录验证
    //导航栏样式
    $('.nav li:eq(4)').addClass('active').siblings().removeClass('active');

    var ServerUrls = {
      SearchSubject: 'Questions',                                               // 查询题目URL [ Questions ]
      StopAndStartSubject: 'Question/{0}/{1}',                                  // 停用、启用题目URL[ Question/{id}/{status} ]
      SaveSubject: 'Question'                                                   // 保存题目URL [ Question ]
    };

    $scope.vm = {
      searchCollection: {                         // 1. 查询原型
        params: {                                    // 1.1 题库查询条件
          searchCode: '',                          // 1.1.1 查询编号
          searchTitle: '',                         // 1.1.2 查询标题
          searchState: {                           // 1.1.3. 排序原型
            data: [{ text: '全部状态', value: '' }, { text: '启用', value: true }, { text: '停用', value: false }],
            count: 3,
            selectItem: ''                       // 1.1.3.1 选择的排序值
          },
        },
        OnClickSearchSubject: function () {           // 1.2 题库查询操作
          var self = $scope.vm.searchCollection,
            subject = $scope.vm.subjectCollection,
            url = ServerUrls.SearchSubject,
            data = {
              IsEnable: self.params.searchState.selectItem,
              Code: self.params.searchCode,
              Title: self.params.searchTitle
            };
          util.ajaxPost($http, url, data, function (result) {
            if (result.state == 1) {
              subject.data = [];
              subject.count = result.Data.length;
              if (subject.count === 0) { util.showFade("没有找到相关的数据！"); } else {
                var model = new ViewModel();
                for (var i = 0; i < subject.count; i++) {
                  var item = model.convertFromSubjectItem(result.Data[i]);
                  subject.data.push(item);
                }
              }
            }
            else {
              //console.log(result);
              util.showFade(result.message);
            }
          }, function (err) { util.showFade(err); });
        }
      },
      subjectCollection: {                            // 2. 题库原型 {subject}
        data: [                                      // 2.1 原始数据
          // {
          //     id, // （编号）
          //     title:'
          //     code:'
          //     tip:'
          //     type:1,
          //     state: false,
          //     answerCollection:{        // 答案列表
          //         data:[                // {answer}
          //             {
          //                 id, // （编号）
          //                 title:'
          //                 _index: 0,
          //                 _isTop: true,
          //                 _isBottom: false
          //             }
          //             // ...
          //         ],
          //         count: 0
          //     }
          // }
        ],
        count: 0,                                    // 2.3 原始数据数量
        current: {                                   // 2.5 当前添加的题目
          _isAdd: false,
          _typeTip: '单选题',
          id: 0, // （编号）
          title: '',
          placeholder: '单选题',
          code: '',
          tipCheck: false,
          tip: '',
          type: 1,
          changeType: function (typeValue) {
            var self = $scope.vm.subjectCollection.current,
              answers = self.answerCollection;
            if (typeValue == 1) {
              self.title = '';
              self.placeholder = '单选题';
              self.tipCheck = false;
              self.tip = '';
              self.type = 1;
              self._typeTip = '单选题';
              for (var i = 0; i < answers.data.length; i++) {
                answers.data[i].type = 'radio';
              }
            } else {
              self.title = '';
              self.placeholder = '多选题';
              self.tipCheck = true;
              self.tip = '多选题';
              self.type = 2;
              self._typeTip = '多选题';
              for (var j = 0; j < answers.data.length; j++) {
                answers.data[j].type = 'checkbox';
              }
            }
            //console.log(self);
          },
          state: false,
          answerCollection: {
            data: [],                        // 答案列表 {answer}
            count: 2,
            OnNext: function (item) {   // 下移答案
              var current = $scope.vm.subjectCollection.current,
                self = current.answerCollection,
                answers = self.data,
                answerLength = answers.length,
                index = -1;

              if (!item._isBottom) {
                for (var i = 0; i < answerLength; i++) {
                  if (answers[i] == item) {
                    index = i;
                    break;
                  }
                }
                if (i != -1) {
                  answers.splice(index, 2, answers[index + 1], answers[index]);
                  for (var j = 0; j < answerLength; j++) {
                    answers[j]._isTop = (j === 0);
                    answers[j]._index = j;
                    answers[j]._isBottom = (j == answerLength - 1);
                  }
                }
              }
            },
            OnPrev: function (item) {   // 上移答案
              var current = $scope.vm.subjectCollection.current,
                self = current.answerCollection,
                answers = self.data,
                answerLength = answers.length,
                index = -1;

              if (!item._isTop) {
                for (var i = 0; i < answerLength; i++) {
                  if (answers[i] == item) {
                    index = i;
                    break;
                  }
                }
                if (i != -1) {
                  answers.splice(index - 1, 2, answers[index], answers[index - 1]);
                  for (var j = 0; j < answerLength; j++) {
                    answers[j]._isTop = (j === 0);
                    answers[j]._index = j;
                    answers[j]._isBottom = (j == answerLength - 1);
                  }
                }
              }
            },
            OnDeleteSelf: function (item) {   // 删除答案
              var current = $scope.vm.subjectCollection.current,
                self = current.answerCollection,
                answers = self.data,
                answerLength = answers.length;

              if (self.count > 2) {
                var newAnswers = [];
                for (var i = 0; i < answerLength; i++) {
                  if (answers[i] != item) {
                    newAnswers.push(answers[i]);
                  }
                }
                self.count = newAnswers.length;
                for (var j = 0; j < self.count; j++) {
                  newAnswers[j]._isTop = (j === 0);
                  newAnswers[j]._index = j;
                  newAnswers[j]._isBottom = (j == self.count - 1);
                }
                // 必须为完整信息
                $scope.vm.subjectCollection.current.answerCollection.data = newAnswers;

              } else {
                util.showFade('选项必须大于等于两项!');
              }
            },
            OnAdd: function () {  // 添加答案
              var current = $scope.vm.subjectCollection.current,
                self = current.answerCollection,
                answers = self.data,
                answerLength = answers.length;
              var item = {
                id: 0, // （编号）
                placeholder: ('选项' + (answerLength + 1)),
                title: '',
                type: (current.type == 1 ? 'radio' : 'checkbox'),
                _index: answerLength,
                _isTop: answerLength === 0,
                _isBottom: true
              };
              answers[answerLength - 1]._isBottom = false;
              answers.push(item);
              self.count += 1;
            }
          }
        },
        OpenSubjectPanel: function () {              // 2.5 添加题目
          var self = $scope.vm.subjectCollection;
          self.OnReset();
          self.current._isAdd = true;

          // var anchor = $location.hash();
          // if(anchor == 'anchorBottom'){
          //     $anchorScroll();
          // }else{
          //     $location.hash('anchorBottom');
          //     $anchorScroll();
          // }
          //console.log(self.count);
          // 当查询的结果集大于两项时，滚动到指定列
          if (self.count > 2) {
            $anchorScroll();
          }
        },
        CloseSubjectPanel: function () {            // 关闭题目
          var self = $scope.vm.subjectCollection;
          self.OnReset();
          self.current._isAdd = false;
        },
        OnReset: function () {            // 重置题目
          var self = $scope.vm.subjectCollection,
            current = self.current;
          current._typeTip = '单选题';
          current.id = 0;
          current.title = '';
          current.placeholder = '单选题';
          current.code = '';
          current.tipCheck = false;
          current.tip = '';
          current.type = 1;
          current.state = false;
          current.answerCollection.data = [
            {
              id: 0, // （编号）
              title: '',
              placeholder: '选项1',
              type: 'radio',
              _index: 0,
              _isTop: true,
              _isBottom: false
            },
            {
              id: 0, // （编号）
              title: '',
              placeholder: '选项2',
              type: 'radio',
              _index: 1,
              _isTop: false,
              _isBottom: true
            }
          ];
          current.answerCollection.count = 2;
        },
        OnSubmit: function () {             // 2.7 保存题目
          var self = $scope.vm.subjectCollection,
            current = self.current,
            validSubject = function () {
              if (!current.code) {
                util.showFade('请录入题目编号！');
                return false;
              }
              if (!current.title) {
                util.showFade('请录入题目！');
                return false;
              }
              for (var i = 0; i < current.answerCollection.count; i++) {
                var item = current.answerCollection.data[i];
                if (!item.title) {
                  util.showFade('请录入题目选项(' + (i + 1) + ')！');
                  return false;
                }
              }
              if (current.code.length > 20) {
                util.showFade('题目编号不能超过20个字符！');
                return false;
              }
              if (current.title.length > 500) {
                util.showFade('题目不能超过500个字符！');
                return false;
              }
              for (var j = 0; j < current.answerCollection.count; j++) {
                var item2 = current.answerCollection.data[j];
                if (item2.title.length > 500) {
                  util.showFade('题目选项(' + (j + 1) + ')不能超过500个字符！');
                  return false;
                }
              }
              return true;
            },
            subjectData = function () {
              var result = {
                Code: current.code,
                Title: current.title,
                Tips: current.tip,
                Type: current.type,
                Items: []
              };
              for (var i = 0; i < current.answerCollection.count; i++) {
                result.Items.push({
                  Content: current.answerCollection.data[i].title
                });
              }
              return result;
            };

          if (validSubject()) {
            util.ajaxPost($http, ServerUrls.SaveSubject, subjectData(), function (result) {
              if (result.state == 1) {
                // 更新绑定数据
                self.data.push({
                  id: result.Data, // （编号）
                  title: current.title,
                  code: current.code,
                  tip: current.tip,
                  type: current.type,
                  state: true,
                  answerCollection: {        // 答案列表
                    data: current.answerCollection.data,
                    count: current.answerCollection.count
                  }
                });
                self.count += 1;
                // 关闭添加页面
                self.CloseSubjectPanel();
              } else { util.showFade(result.message); }
            }, function (err) { util.showFade(err); });
          }
        },
        OpenStateDialog: function (item) {             // 2.8 启用或停用题目
          var self = $scope.vm.subjectCollection,
            current = self.current;
          current.id = item.id;
          current.state = item.state;
        },
        OnChangeState: function () {
          var self = $scope.vm.subjectCollection,
            current = self.current,
            url = String.prototype.format(ServerUrls.StopAndStartSubject, current.id, !current.state);
          util.ajaxGet($http, url, function (result) {
            if (result.state == 1) {
              current.state = !current.state;
              for (var i = 0; i < self.count; i++) {
                if (self.data[i].id == current.id) {
                  self.data[i].state = current.state;
                  break;
                }
              }
            }
            else { util.showFade(result.message); }
          }, function (err) { util.showFade(err); });
        }
      },
      Init: function () {                               // 4. 初始化
        $location.hash('anchorBottom');
      }
    };

    $scope.vm.Init();

  }]);
  return app;
});
