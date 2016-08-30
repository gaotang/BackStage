define([], function () {
	var constData={}
	constData.PostionCategory = 1000;         // 职称类型

	constData.AccountRoleTypes = [
	{text:'---请选择角色---',value:-1},
	{text:'admin',value:0},
	{text:'运维',value:1},
	{text:'医生',value:2},
	{text:'管理者',value:3}];

	constData.AccountDeptTypes = [
	{text:'上海好卓',value:-1}
	]

	constData.AutoSendExecTypes = [          /* 自动发送执行状态 */
	{ text: "--全部状态--", value: -1 },
	{ text: "执行中", value: 1 },
	{ text: "已结束", value: 0 }];

	constData.JobTypes = [
	{text:"请选择服务状态",value:-1},
	{text:"全职",value:0},
	{text:"兼职",value:1}];

	constData.GroupTypes =[
	{text:"请选择分组类型", value:-1},
    {text:"各项指标正常", value:0},
    {text:"其它", value:1},
    {text:"慢病(需计算指标)", value:2}];

    constData.RequestTypes =[
	{text:"请选择请求方", value:-1},
	{text:"上海好卓", value:"FromHZ"},
    {text:"杭州优健康", value:"FromYJK"},
    {text:"数据中心", value:"FromDC"}];

    constData.ExecuteTypes =[
	{text:"请选择执行状态", value:-1},
    {text:"成功", value:true},
    {text:"失败", value:false}];

	constData.findJobText=function(value){
		var items = constData.JobTypes;
		for (j=0;j<items.length;j++){
			var item = items[j];
			if (item.value == value){
				return item.text;
			}
		}
		return "未知"
	}

	constData.checkUnitCode = [{value:0},{value:1},{value:2},{value:3},{value:4}];
	return constData;
})