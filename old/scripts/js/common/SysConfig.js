define([], function () {
  var _self = {};
  _self.ApiEnv = "test";//接口环境
  _self.AppKey = "HZ_API_V2";
  _self.AppSecret = "1!2@3#4$5%6^";

  //接口列表
  _self.BaseUrl = {};
  _self.BaseUrl.local = "http://HZP229HQL:19949/api/";
  _self.BaseUrl.zhuli = "http://HZP229HQL:8888/api/";
  _self.BaseUrl.zhuli2 = "http://HZP229HQL:19949/api/";
  _self.BaseUrl.libo = "http://HZGWGGDC2:19999/api/";
  _self.BaseUrl.dev = "http://hzswvajgs01:90/api/";
  _self.BaseUrl.test = "http://hzswvajgs01:91/api/";
  _self.BaseUrl.pro = "http://hc.ihaozhuo.com:90/api/";

  _self.getBaseUrl = function () {
    return _self.BaseUrl[_self.ApiEnv];
  };

  _self.autoSend = {
    TIP: "，请点击",
    DATE: {
      "default": "[MDATA[{MM}月{dd}日]]"
    },
    EXT: {
      "bjbr001": "省直三院退订回N",
      "bjbr002": "安宁鑫湖医院退订回N",
      "default": "  退订回N"
    },
    URL: {
      pro: "http://webapp.hc.ihaozhuo.com/SMSPromotion.html#",
      test: "http://hzswvajgs01:100/SMSPromotion.html#",
      dev: "http://10.50.50.71:8081/SMSPromotion.html#"
    },
    GetURL: function () {
      return _self.autoSend.URL[_self.ApiEnv] || _self.autoSend.URL["dev"];
    },

  };

  return _self;
});
