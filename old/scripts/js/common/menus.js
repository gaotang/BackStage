define([], function () {
  var _self = {
    Data: [
      {
        "code": "10000",
        "name": "系统管理",
        "action": "",
        "checked": false,
        "children": [
          {
            "code": "10001",
            "name": "服务机构",
            "action": "#/server",
            "checked": false
          },
          {
            "code": "10002",
            "name": "账号管理",
            "action": "#/userManagement",
            "checked": false
          },
          {
            "code": "10003",
            "name": "接口日志查询",
            "action": "#/journaled",
            "checked": false
          }
        ]
      },
      {
        "code": "20000",
        "name": "医学数据管理",
        "action": "",
        "checked": false,
        "children": [
          {
            "code": "20001",
            "name": "分组管理",
            "action": "#/group",
            "checked": false
          },
          {
            "code": "20002",
            "name": "常用短语",
            "action": "#/usually",
            "checked": false
          },
          {
            "code": "20003",
            "name": "客户机构调整",
            "action": "#/customlist",
            "checked": false
          },
          {
            "code": "20004",
            "name": "咨询量统计",
            "action": "#/consultStatistic",
            "checked": false
          },
          {
            "code": "20005",
            "name": "问卷题库",
            "action": "#/questionLibrary",
            "checked": false
          },
          {
            "code": "20006",
            "name": "问卷调查",
            "action": "#/questionDetail",
            "checked": false
          }
        ]
      },
      {
        "code": "30000",
        "name": "运营管理",
        "action": "",
        "checked": false,
        "children": [
          {
            "code": "30001",
            "name": "短信推广",
            "action": "#/message",
            "checked": false
          },
          {
            "code": "30002",
            "name": "短信推广统计",
            "action": "#/messageStatistic",
            "checked": false
          }
        ]
      }
    ]
  };

  return _self;
});
