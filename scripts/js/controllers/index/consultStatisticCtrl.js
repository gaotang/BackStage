define(['indexApp', 'Extend', 'highcharts', 'common/util', 'model/consultStatisticModel', 'hcexporting', 'hcexportingcsv', 'pikaday', 'service/baseService', 'jQueryUi', 'timePicker'], function (app, Extend, highcharts, util, consultStatisticModel, exporting, exportCSV, pikaday) {
  app.controller('consultStatisticCtrl', ['$scope', '$http', 'signValid', function ($scope, $http, signValid) {
    signValid.ValidAccess("#/consultStatistic");                       //缓存登录验证
    //导航栏样式
    $(".nav li:eq(4)").addClass("active").siblings().removeClass("active");
    //初始化时间，默认查询过去两周的统计数据
    var endDate = new Date();
    var startDate = endDate.AddDay(-13);
    $scope.endDate = endDate.Format("yyyy/MM/dd");
    $scope.startDate = startDate.Format("yyyy/MM/dd");

    //******************插入日历控件****************************

    var startDateTextBox = $('#startDate');
    var endDateTextBox = $('#endDate');
    $.timepicker.dateRange(
      startDateTextBox,
      endDateTextBox,
      {
        changeMonth: true,
        buttonImageOnly: true,
        dateFormat: "yy/mm/dd",
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNamesMin: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        minInterval: (1000 * 60 * 60 * 24 * 1), // 1 days
      }
    );

    // var pickerStart = new pikaday(
    //     {
    //         field: document.getElementById('startDate'),
    //         firstDay: 1,
    //         minDate: new Date('2010-01-01'),
    //         maxDate: new Date('2020-12-31'),
    //         yearRange: [2000,2020]
    //     });

    // var pickerEnd = new pikaday(
    //     {
    //         field: document.getElementById('endDate'),
    //         firstDay: 1,
    //         minDate: new Date('2010-01-01'),
    //         maxDate: new Date('2020-12-31'),
    //         yearRange: [2000,2020]
    //     });

    //******************请求咨询数据****************************

    successCallback = function (result) {
      if (result.state == 1) {
        var consultStatisticItems = [];
        var xAxis = [];
        var registList = [];
        var askCountList = [];
        var askPersonsList = [];
        for (var i = 0; i < result.Data.length; i++) {
          var consultStatisticItem = new consultStatisticModel();
          consultStatisticItem.convertFrom(result.Data[i]);
          consultStatisticItems.push(consultStatisticItem);
          xAxis.push(consultStatisticItem.time);
          registList.push(consultStatisticItem.AppRegisteCount);
          askCountList.push(consultStatisticItem.AskCount);
          askPersonsList.push(consultStatisticItem.AskPersons);
        }
        $scope.consultStatisticItems = consultStatisticItems;

        //****生成图表****

        chart = new Highcharts.Chart({
          chart: {
            renderTo: 'container'
          },
          title: { text: null, x: -20 },   //center
          xAxis: { categories: xAxis },
          yAxis: {
            title: { text: null },
            plotLines: [{ width: 1, color: '#808080' }]
          },
          series: [
            { name: '注册量', data: registList },
            { name: '提问次数', data: askCountList },
            { name: '提问人数', data: askPersonsList }
          ],
          credits: { enabled: false }//不显示版权信息
        });

        //****自定义导出按钮****
        // $("#download").click(function(){
        //     Highcharts.post('http://export.hcharts.cn/cvs.php', {
        //       csv: chart.getCSV()
        //     });
        //   })
        //****自定义导出按钮****

        // var chartData={
        //      title: {text: null,x: -20},//center
        //      xAxis: {categories: xAxis},
        //      yAxis: {
        //      	title: {text: null},
        //          plotLines: [{width: 1,color: '#808080'}]
        //      },
        //      series: [
        //       {name: '注册量',data: registList},
        //       {name: '提问次数',data: askCountList},
        //       {name: '提问人数',data: askPersonsList}
        //      ],
        //      credits: {enabled:false}//不显示版权信息
        //     }

        //  $('#container').highcharts(chartData);//生成图表
      }
      else {
        alert(result.message);
      }
    };
    errorCallback = function (result) {
      alert("Error");
    };
    var requestHandler = function () {
      if ($('#startDate').val() && $('#endDate').val()) {
        $scope.startDate = $('#startDate').val();
        $scope.endDate = $('#endDate').val();
      }
      var url = "Statistic/GetStatistics?start=" + $scope.startDate + "&end=" + $scope.endDate;
      util.ajaxGet($http, url, successCallback, errorCallback);
    };
    $scope.RequestHandler = requestHandler;
    requestHandler();
  }]);
  return app;
})
