var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var uglifyes    = require('gulp-uglifyes');
var buffer      = require('vinyl-buffer');


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app/public'
    },
    open: false,
    notify: false,
    reloadOnRestart: true,
    // online: true,
  })
});


gulp.task('browserify', function(){
  return browserify({ 
          entries: 'app/src/js/main.js', 
          debug: true,
          cache: {},
          packageCache:{},
          plugin: [watchify] 
        })
    .transform(babelify, {
      presets: ["es2015"]
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(uglifyes())
    .pipe(gulp.dest('app/public/build'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('html', function(){
  return gulp.src('app/src/index.html')
    .pipe(gulp.dest('app/public'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('sass', function(){
	return gulp.src('app/src/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/public/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});


gulp.task('watch', [ 'browserSync', 'browserify', 'html', 'sass'], function (){
  gulp.watch('app/src/js/*.js', ['browserify']); 
  gulp.watch('app/src/*.html', ['html']); 
  gulp.watch('app/src/scss/*.scss', ['sass']); 
});