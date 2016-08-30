define(['indexApp', 'Extend', 'highcharts', 'common/util', 'hcexporting', 'hcexportingcsv', 'model/serviceDeptItemModel', 'model/messageStatisticModel', 'jQueryUi', 'timePicker', 'bootStrapMultiselect', 'service/baseService'],
  function (app, Extend, highcharts, util, exporting, exportCSV, serviceDeptItemModel, messageStatisticModel) {
    app.controller('messageStatisticCtrl', function ($scope, $http, signValid) {
      signValid.ValidAccess("#/messageStatistic");                       //缓存登录验证
      //导航栏样式
      $(".nav li:eq(11)").addClass("active").siblings().removeClass("active");
      //初始化时间及格式
      var endDate = new Date();
      var startDate = endDate.AddDay(-13);
      $scope.endDate = endDate.Format("yyyy/MM/dd");
      $scope.startDate = startDate.Format("yyyy/MM/dd");

      $scope.deptID = -1;
      $scope.smsMargin = 0;
      var GolbalDeptList = [];
      var params = { deptID: "", startDate: "", endDate: "" };

      /*****************初始化图表信息******************/
      var ResetChartdata = function () {
        chartData = {
          xAxis: [],
          SmsSendCount: [],
          Hits: [],
          Dloaded: [],
          ClickRate: [],
          DownloadRate: [],
          EnrollmentRate: [],
          Registrations: []
        };
      }
      /*****************获取查询参数********************/
      var getParams = function () {
        $scope.startDate = $('#startDate').val();
        $scope.endDate = $('#endDate').val();
        params = { deptID: $scope.deptID, startDate: $scope.startDate, endDate: $scope.endDate };
        if (params.deptID == 0) {     //null为查询全部机构
          params.deptID = null;
        }
      }
      /*****************生成图表************************/
      var GetCharts = function () {
        chart = new Highcharts.Chart({
		        chart: {
		         	renderTo: 'container'
		        },
		        title: { text: null, x: -20 },//center
	        	xAxis: { name: "日期", categories: chartData.xAxis },
	        	yAxis: [{
            labels: { format: '{value}', style: { color: '#89A54E' } },
            title: { text: '量', style: { color: '#89A54E' } }
          },
            {
              title: { text: '率', style: { color: '#4572A7' } },
              labels: { formatter: function () { return this.value * 100 + '%'; }, style: { color: '#4572A7' } },
              opposite: true
            }],
		        series: [
            { name: '发送量', data: chartData.SmsSendCount, type: 'column' },
            // {name: '发送量',data: [1,2,3,4,5,6,7,8,9,1,1,1,1,1],type: 'column'},
            { name: '点击量', data: chartData.Hits, type: 'column' },
            { name: '下载量', data: chartData.Dloaded, type: 'column' },
            { name: '注册量', data: chartData.Registrations, type: 'column' },
            { name: '点击率', data: chartData.ClickRate, yAxis: 1, tooltip: { pointFormatter: function () { return this.series.name + ":" + this.y * 100 + '%'; } } },
            // {name: '点击率',data: [0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08,0.09,0.01,0.01,0.01,0.01,0.01],yAxis: 1,tooltip: {pointFormatter:function() {return this.series.name+":"+this.y*100 +'%';}}},
            { name: '下载率', data: chartData.DownloadRate, yAxis: 1, tooltip: { pointFormatter: function () { return this.series.name + ":" + this.y * 100 + '%'; } } },
            { name: '注册率', data: chartData.EnrollmentRate, yAxis: 1, tooltip: { pointFormatter: function () { return this.series.name + ":" + this.y * 100 + '%'; } } }
		        ],
		        credits: { enabled: false }//不显示版权信息
        });
      }
      /*****************查询统计信息********************/

      $scope.QuerySubmit = function () {
        if ($scope.deptID == -1) {
          util.showFade("请选择要查询的机构");
          return;
        }
        ResetChartdata();       //初始化图表信息
        getParams();            //获取查询参数
        var url = "Statistic/GetSmsStatistics?deptID=" + params.deptID + "&start=" + params.startDate + "&end=" + params.endDate;
        util.ajaxGet($http, url, function (result) {
          if (result.state == 1) {
            ResetChartdata();
            var statisticResult = result.Data.StatisticResult;
            var sumResult = result.Data.Total;
            var dataList = [];
            for (var i = 0; i < statisticResult.length; i++) {
              var dataItem = new messageStatisticModel();
              dataItem.convertFrom(statisticResult[i]);
              dataList.push(dataItem);
              chartData.xAxis.push(dataItem.Date);
              chartData.SmsSendCount.push(statisticResult[i].SmsSendCount);
              chartData.Hits.push(statisticResult[i].Hits);
              chartData.Dloaded.push(statisticResult[i].Dloaded);
              chartData.Registrations.push(statisticResult[i].Registrations);
              chartData.ClickRate.push(statisticResult[i].ClickRate);
              chartData.DownloadRate.push(statisticResult[i].DownloadRate);
              chartData.EnrollmentRate.push(statisticResult[i].EnrollmentRate);
            }
            dataList.push({ Date: "总计", SmsSendCount: sumResult.SmsSendCount, Hits: sumResult.Hits, Dloaded: sumResult.Dloaded, ClickRate: sumResult.ClickRate.toPercent(), DownloadRate: sumResult.DownloadRate.toPercent(), EnrollmentRate: sumResult.EnrollmentRate.toPercent(), Registrations: sumResult.Registrations })
            $scope.dataList = dataList;
            GetCharts();
          }
        }, function (err) {
          util.showFade("未能查询到相关信息");
        })
      }

      /*****************日历*****************/
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
          minInterval: (1000 * 60 * 60 * 24 * 0), // 0 days
        }
      );

      /************获取剩余短信数*************/
      var url = "Sms/GetSmsMargin";
      util.ajaxGet($http, url, function (result) {
        if (result.state == 1) {
          $scope.smsMargin = result.Data;
        }
      }, function (err) { })

      /*************获取机构信息**************/
      var url = "ServiceDept/GetAllServiceDepts"
      util.ajaxGet($http, url, function (result) {
        if (result.state == 1) {
          GolbalDeptList = [{ Id: -1, Name: "请选择要查询的机构" }, { Id: 0, Name: "全部" }];
          for (var i = 0; i < result.Data.length; i++) {
            if (result.Data[i].IsSendSms) {
              var deptItem = new serviceDeptItemModel();
              deptItem.convertFrom(result.Data[i]);
              GolbalDeptList.push(deptItem);
            }
          }
          $scope.deptList = GolbalDeptList;
        }
      }, function (err) { })

      /*****************选项卡***************/
      // var aLi=$('#root .panel-body>span')
      // var oBox=$('.rootdiv')
      // for(var i=0; i<2;i++){
      // 	aLi[i].index=i;
      // 	aLi[i].onclick=function(){
      // 		for(var i=0;i<2;i++){
      // 			aLi[i].className="";
      // 			oBox[i].style.display="none";
      // 		}
      // 		this.className="clickspan";
      // 		oBox[this.index].style.display="block";
      // 	}
      // }
    });
    return app;
  })
