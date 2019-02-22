const themeName = 'main',
	dest = './',
	mainStylesheet = 'src/css/style.scss';

const gulp = require("gulp"),
	autoprefixer = require("gulp-autoprefixer"),
	babel = require('gulp-babel'),
	browserSync = require('browser-sync').create(),
	del = require('del'),
	eslint = require('gulp-eslint'),
	imagemin = require('gulp-imagemin'),
	minify = require('gulp-babel-minify'),
	rename = require('gulp-rename');
	sass = require("gulp-sass"),
	sourcemaps = require('gulp-sourcemaps');



// Concat SCSS files to CSS for development
gulp.task("scss", function() {
	gulp.src(mainStylesheet)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle : "compact"
		}))
		.pipe(autoprefixer({
			browsers : ["last 20 versions"]
		}))
		.pipe(rename(`${themeName}.css`))
		.pipe(sourcemaps.write('src/maps'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream());
});


// Compress SCSS files for production
gulp.task("compress_scss", function() {
	gulp.src(mainStylesheet)
		.pipe(sass({
			outputStyle : "compressed"
		}))
		.pipe(autoprefixer({
			browsers : ["last 20 versions"]
		}))
		.pipe(rename(`${themeName}.css`))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream());
});


// Conpile JS for development
gulp.task('js', function() {
	gulp.src('src/js/main.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(rename(`${themeName}.js`))
		.pipe(sourcemaps.write('src/maps'))
		.pipe(gulp.dest(dest))
		.pipe(browserSync.stream());
});


// Compile JS for production
gulp.task('buildjs', function () {
	gulp.src('src/js/main.js')
		.pipe(babel())
		.pipe(minify({
			mangle: {
				keepClassName: true
			}
		}))
		.pipe(rename(`${themeName}.js`))
		.pipe(gulp.dest(dest));
});


// Watch asset folder for local development changes
gulp.task("watch", ["scss", "js"], function() {
	console.log('Starting dev server…\n');
	browserSync.init({
		proxy: 'http://localhost:8080',  // assumes http-server is running @ default port
		open: false,
		notify: true,
		reloadOnRestart: true,
		ghostMode: false,
		scrollThrottle: 200
	});
	gulp.watch("src/css/**/*", ["scss"]);
	gulp.watch("src/js/**/*", ["js"]);
});


// Clear development files for production
gulp.task("clean", function () {
	console.log('Deleting map files…\n');
	return del(['src/maps/**/*.map']);
});


// Minify images
gulp.task("min_images", function() {
	gulp.src('src/img/*')
		.pipe(imagemin([], {
			verbose: true
		}))
		.pipe(gulp.dest('assets/img'));
});


// Build files for production
gulp.task("build", ["clean", "min_images", "compress_scss", "buildjs"], function() {
	gulp.task("src/js/**/*", ["buildjs"]);
	gulp.task(mainStylesheet, ["compress_scss"]);
	console.log('Production build complete!\n');
});


// Set watch as default task
gulp.task("default", ["watch"]);

