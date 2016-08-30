'use strict';

/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/
const gulp = require('gulp');
const runSequence = require('run-sequence');             // 并行执行任务
const $ = require('gulp-load-plugins')();                // 加载 gulp 插件

/*-------------------------------------------------------------------
  Configuration
-------------------------------------------------------------------*/
const projectName = 'BackStage';
const qiniu = {
  accessKey: '',
  secretKey: '',
  bucket: '',
  domain: 'http://'
};
const bui = {
  js: projectName + '-js',
  images: projectName + '-images',
  css: projectName + '-css',
  fonts: projectName + '-fonts',
  html: projectName + '-html',
  page: projectName + '-page',
  watch: projectName + '-watch',
  webserver: projectName + '-webserver',
  jshint: projectName + '-jshint'
};
const path = {
  js: './scripts/js',
  images: './img',
  css: './css',
  fonts: './fonts',
  html: './html',
  page: '.',
  deploy: './public'
};
const watch = {
  js: ['!' + path.js + '/lib/*.js', path.js + '/**'],
  minJs: path.js + '/lib/*.js',
  images: path.images + '/*',
  css: path.css + '/*.css',
  fonts: path.fonts + '/*',
  html: path.html + '/**',
  page: path.page + '/*.html'
};
const deploy = {
  js: path.deploy + '/scripts/js',
  minJs: path.deploy + '/scripts/js/lib',
  images: path.deploy + '/img',
  css: path.deploy + '/css',
  fonts: path.deploy + '/fonts',
  html: path.deploy + '/html',
  page: path.deploy
};
const smile = $.util.colors.bgBlue(' ^_^ ');
const watchBuiArr = [bui['images'], bui['js'], bui['css'], bui['fonts'], bui['html'], bui['page']];
let watchArr = [];

/*-------------------------------------------------------------------
  DEV TASKS
-------------------------------------------------------------------*/
gulp.task(bui['js'], function () {
  $.util.log(smile + ' -> ' + bui['js']);
  // 已经压缩过的文件
  gulp.src(watch.minJs)
      .pipe(gulp.dest(deploy.minJs));

  return gulp.src(watch.js)
    .pipe($.uglify())
    .pipe(gulp.dest(deploy.js));
});

gulp.task(bui['images'], function () {
  $.util.log(smile + ' -> ' + bui['images']);
  return gulp.src(watch.images)
    // .pipe(imagemin())
    .pipe(gulp.dest(deploy.images));
});

gulp.task(bui['css'], function () {
  $.util.log(smile + ' -> ' + bui['css']);
  return gulp.src(watch.css)
    // .pipe(autoprefixer({ browsers: ['last 2 versions'], }))
    .pipe($.cleanCss())
    .pipe($.flatten())
    .pipe(gulp.dest(deploy.css));
});

gulp.task(bui['fonts'], function () {
  $.util.log(smile + ' -> ' + bui['fonts']);
  return gulp.src(watch.fonts)
    .pipe($.flatten())
    .pipe(gulp.dest(deploy.fonts));
});

gulp.task(bui['html'], function () {
  $.util.log(smile + ' -> ' + bui['html']);
  return gulp.src(watch.html)
    .pipe($.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(deploy.html));
});

gulp.task(bui['page'], function () {
  $.util.log(smile + ' -> ' + bui['page']);
  return gulp.src(watch.page)
    .pipe($.htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(deploy.page));
});

gulp.task(bui['watch'], function () {
  $.util.log(smile + ' -> ' + bui['watch']);
  for (let i in watch) {
    watchArr.push(watch[i]);
  }
  $.util.log(smile + ' -> ' + 'watch path: ');
  $.util.log(watchArr);
  runSequence(watchBuiArr);
  gulp.watch(watchArr, watchBuiArr);
});

gulp.task(bui['webserver'], function () {
  $.util.log(smile + ' -> ' + bui['webserver']);
  gulp.src('./')
    .pipe($.webserver({
      port: 8001,
      livereload: true,
      directoryListing: true,
      open: 'public/index.html'
    }));
});

gulp.task(bui['jshint'], function () {
  $.util.log(smile + ' -> ' + bui['jshint']);

  var sourceJs = ['./scripts/js/controllers/index/*.js', './scripts/js/model/*.js'];
  sourceJs = ['./scripts/js/controllers/index/questionLibraryCtrl.js'];

  // return gulp.src(watch.js)
  return gulp.src(sourceJs)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('default', function (callback) {
  console.dir(watchBuiArr);
  runSequence(
    // bui['jshint'],
    bui['webserver'],
    bui['watch'],
    callback);
});

/*-------------------------------------------------------------------
  PUBLIC TASKS
-------------------------------------------------------------------*/

// gulp.task('testJs', function(){
//   $.util.log(smile + ' -> ' + 'testJs');
//   return gulp.src(watch.js)
//     .pipe(replace('$loginURL', '/index.html'))
//     .pipe(replace('$logoutURL', '/login.html'))
//     //  .pipe(uglify({
//     //         mangle: false,//类型：Boolean 默认：true 是否修改变量名
//     //         compress: true,//类型：Boolean 默认：true 是否完全压缩
//     //         preserveComments: 'all' //保留所有注释
//     //     }))
//     .pipe(gulp.dest(deploy.js));
// });

// gulp.task('build', function (callback) {
//   watchBuiArr.push('testJs');
//   console.dir(watchBuiArr);
//   runSequence(watchBuiArr);
// });

/*-------------------------------------------------------------------
  OTHERS
-------------------------------------------------------------------*/
// const cleanCSS = require('gulp-clean-css')              // 压缩 CSS
// const htmlmin = require('gulp-htmlmin')                 // 压缩 HTML
// const imagemin = require('gulp-imagemin')               // 压缩 图片,SVG
// const uglify = require('gulp-uglify')                   // 压缩 Javascript
// const replace = require('gulp-replace')                 // 文件 替换
// const concat = require('gulp-concat')                   // 文件 合并
// const fileinclude = require('gulp-file-include')        // 文件 导入
// const flatten = require('gulp-flatten')                 // 移动指定文件
// const gutil = require('gulp-util')                      // 工具类
// const webserver = require('gulp-webserver')             // Web 服务器
// const runSequence = require('run-sequence')             // 并行执行任务

// const autoprefixer = require('gulp-autoprefixer')       // CSS 增加前缀
// const sass = require('gulp-sass')                       // sass to css
// gulp-rename 修改文件名称
// gulp-jshint JavaScript 代码校验
// gulp-less   less to css
// gulp-rev 把静态文件名改成hash的形式
// gulp-rev-replace 配合 gulp-rev 使用，拿到生成的 manifest。json 后替换对应的文件名称
// gulp-rev-collector 到线上环境前，俺会用来配合gulp-rev使用，替换 HTML 中的路径
// gulp-rev-append 给页面引用的静态文件增加hash后缀，避免被浏览器缓存…当然，如果是使用 CDN，这个套路就不行了

// .pipe(uglify({
//         mangle: true,//类型：Boolean 默认：true 是否修改变量名
//         compress: true,//类型：Boolean 默认：true 是否完全压缩
//         preserveComments: 'all' //保留所有注释
//     }))

// .pipe(fileinclude({prefix: '@@',basepath: '@file'}))

