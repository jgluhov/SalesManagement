var gulp = require('gulp');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('browserSync', function() {
	browserSync.init({
		proxy: 'localhost:3000'
	});

	gulp.watch('src/stylus/*.styl', ['stylus']);
	gulp.watch("src/js/*.js", ["js"]);
	gulp.watch('views/**/*.jade').on('change', browserSync.reload);
});

gulp.task('stylus', function(){
	return gulp.src('src/stylus/*.styl')
		.pipe(plumber())
		.pipe(stylus({compress: true}))
		.pipe(gulp.dest('./public/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function() {
	return browserify('src/js/main.js')
		.transform('uglifyify')
		.bundle()
		.on('error', function(err){
			console.log(err.message);
			this.emit('end');
		})
		.pipe(source('bundle.min.js'))
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.stream());
});

gulp.task('libs', function() {
	return browserify('src/js/production.js')
		.transform('uglifyify')
		.bundle()
		.on('error', function(err){
			this.emit('end');
		})
		.pipe(source('angular.bundle.min.js'))
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.stream());
});

gulp.task('production', ['libs']);

gulp.task('default', ['browserSync','stylus','js']);