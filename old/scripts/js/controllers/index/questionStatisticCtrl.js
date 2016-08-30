define(['indexApp', 'Extend', 'highcharts', 'common/util', 'hcexporting', 'hcexportingcsv', 'model/questionStatisticModel'], function (app, Extend, highcharts, util, exporting, exportCSV, ViewModel) {
  app.controller('questionStatisticCtrl', function ($scope, $http) {
    //导航栏样式
    $(".nav li:eq(4)").addClass("active").siblings().removeClass("active");

    // Bussiness Logic
    console.log("开发进行中...")

  });
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
