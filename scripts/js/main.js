var base = '/scripts/js';
var urlArgs = "CDNVersion=" + new Date().getTime()
/*if (environment == "pro") {
    base = '/Scripts/js-build';
    urlArgs = "CDNVersion=v16"
}*/
require.config({
    baseUrl: base,
    urlArgs: urlArgs,
    waitSeconds: 200,
    paths: {
        angular: 'lib/angular.min',
        router: 'lib/angular-route.min',
        jquery:'lib/jquery-1.11.3.min',
        bootStrap: 'lib/bootstrap.min',
        bootStrapMultiselect: 'lib/bootstrap-multiselect',
        underscore: 'lib/underscore.min',
        highcharts: 'lib/highcharts',
        sysConfig: 'common/SysConfig',
        indexApp: 'app/indexApp',
        loginApp: 'app/loginApp',
        Extend: 'common/Extend',
        pikaday:'lib/pikaday.min',
        hcexporting:'lib/exporting',
        hcexportingcsv:'lib/export-csv',
        jqueryMD5: 'lib/jquery.md5',
        jQueryUi: 'lib/jquery-ui.min',
        timePicker: 'lib/jquery-ui-timepicker-addon'
    },
    shim: {
        angular:{
            exports:'angular'
        },
        router: {
            deps: ['angular'],
            exports:'router'
        },
        bootStrap: {
            deps: ['jquery'],
            exports:'bootStrap'
        },
        bootStrapMultiselect: {
            deps: ['jquery', 'bootStrap'],
            exports: 'bootStrapMultiselect'
        },
        underscore: {
            exports: 'underscore'
        },
        highcharts:{
            exports:'highcharts'
        },
        hcexporting: {
            deps: ['highcharts'],
            exports:'hcexporting'
        },
        hcexportingcsv: {
            deps: ['highcharts'],
            exports:'hcexportingcsv'
        },pikaday:{
            exports:'pikaday'
        },jqueryMD5: {
            deps: ['jquery'],
            exports: 'jqueryMD5'
        },timePicker: {
            deps: ['jQueryUi'],
            exprots:'timePicker'
        }, jQueryUi: {
            deps: ['jquery'],
            exprots: 'jQueryUi'
        }
    }
});
