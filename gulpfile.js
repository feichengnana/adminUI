var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var connect = require('gulp-connect');

//本地服务启动任务
gulp.task('localhost', function() {
  connect.server();
});

gulp.task('localhost-live', function() {
  connect.server({
    livereload: true
  });
});

//sass编译
gulp.task('sass', function () {
	
	gulp.src('./sass/bootstrap.scss')
	.pipe(sass())
	.pipe(gulp.dest('./static/plugins/bootstrap/css'));
	
	gulp.src('./sass/adminui.scss')
	.pipe(sass())
	.pipe(gulp.dest('./static/css'));
	
});

gulp.task('concatDatatable', function() {
		//css concat
  	gulp.src(['./static/plugins/datatables/css/dataTables.bootstrap.min.css', 
  	'./static/plugins/datatables/extensions/FixedColumns/fixedColumns.bootstrap.min.css', 
  	'./static/plugins/datatables/extensions/responsive/responsive.bootstrap.min.css',
  	'./static/plugins/datatables/extensions/Buttons/buttons.dataTables.css',
  	'./static/plugins/datatables/extensions/Buttons/buttons.bootstrap.css'])
    .pipe(concat('datatables.all.min.css'))
    .pipe(gulp.dest('./static/plugins/datatables'));
    
    //js concat
    gulp.src(['./static/plugins/datatables/js/jquery.dataTables.min.js', 
    './static/plugins/datatables/js/dataTables.bootstrap.min.js', 
    './static/plugins/datatables/extensions/FixedColumns/dataTables.fixedColumns.min.js',
    './static/plugins/datatables/extensions/responsive/dataTables.responsive.min.js',
    './static/plugins/datatables/extensions/responsive/responsive.bootstrap.min.js',
    './static/plugins/datatables/extensions/Buttons/dataTables.buttons.js',
    './static/plugins/datatables/extensions/Buttons/buttons.bootstrap.js',
    './static/plugins/jszip.min.js',
    './static/plugins/pdfmake.min.js',
    './static/plugins/vfs_fonts.js',
    './static/plugins/datatables/extensions/Buttons/buttons.html5.js',
    './static/plugins/datatables/extensions/Buttons/buttons.print.min.js',
    './static/plugins/datatables/extensions/Buttons/buttons.colVis.min.js'])
    .pipe(concat('dataTables.all.min.js'))
    .pipe(gulp.dest('./static/plugins/datatables'));
});


gulp.task('minify', function () {
		// css minify 
    gulp.src(['./static/plugins/bootstrap/css/*.css','!./static/plugins/bootstrap/css/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/bootstrap/css'));
    
    gulp.src(['./static/css/*.css','!./static/css/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/css'));
    
    gulp.src(['./static/plugins/ace/css/*.css','!./static/plugins/ace/css/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/ace/css'));
    
    //minify datatables.css
//  gulp.src(['./static/plugins/datatables/*.css','!./static/plugins/datatables/*.min.css'])
//  .pipe(minifyCss())
//  .pipe(rename({suffix: '.min'}))
//  .pipe(gulp.dest('./static/plugins/datatables'));
    
    //js minify
    gulp.src(['./static/js/*.js','!./static/js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'));
    
     gulp.src(['./static/plugins/ace/js/*.js','!./static/plugins/ace/js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/ace/js'));
    
//  gulp.src(['./static/plugins/datatables/*.js','!./static/plugins/datatables/*.min.js'])
//  .pipe(minifyCss())
//  .pipe(rename({suffix: '.min'}))
//  .pipe(gulp.dest('./static/plugins/datatables'));

});

gulp.task('sass:watch', function () {
	//gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default',['sass','minify','concatDatatable'], function() {
  // 将你的默认的任务代码放在这
});