var webpack = require('webpack');
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var LIBS_PATH = path.resolve(SRC_PATH, 'libs');

module.exports = {
    devtool: 'source-map', // 由于打包后的代码是合并以后的代码，不利于排错和定位，只需要在config中添加，这样出错以后就会采用source-map的形式直接显示你出错代码的位置。
    entry: SRC_PATH + '/scripts/main.js',
    output: {
        path: BUILD_PATH,
        filename: 'build.js'
    },
    module: {
        loaders: [
            // .css 文件使用 style-loader 和 css-loader 来处理
            { test: /\.css$/, loader: 'style!css' },
            // 图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]' }
        ]
    },
    resolve: {
        root: LIBS_PATH,
        extensions: ['', '.js', '.jsx'],
        alias: {
            avalon: 'avalon/dist/avalon.js',
            jquery: 'jquery/dist/jquery.min.js',
            bootstrap: 'bootstrap/dist/js/bootstrap.min.js'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({ // 把一个全局变量插入到所有的代码中,支持jQuery plugin的使用;使用ProvidePlugin加载使用频率高的模块
            // provide $, jQuery and window.jQuery to every script
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        // 内联css提取到单独的styles的css
        new ExtractTextPlugin('index.css'),
        new HtmlwebpackPlugin({
            title: 'Hello World app', // 生成新的html页面的title;
            // template: 'html!./index.html',
            hash: true,
            minify: {                       // 压缩HTML文件
                removeComments: true,       // 移除HTML中的注释
                collapseWhitespace: true    // 删除空白符与换行符
            }
        }),
        new webpack.BannerPlugin('This file is created by gaotang')    // 加载内部插件，无效不知道为什么
    ]
}
