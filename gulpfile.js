const themeName = 'main',
	outputCSSName = themeName,  // change this to your output stylesheet filename (optional)
	outputJSName = themeName,  // change this to your output javascript filename (optional)
	outputPath = './',  // path to output files
	stylesPath = 'src/css/',  // path to your style.scss file
	scriptsPath = 'src/js/',  // path to your main.js file
	srcMapPath = 'src/maps/',
	imgPath = 'src/img/',
	imgOutput = 'assets/img/',
    mainStylesheet = `${stylesPath}style.scss`,
	mainScript = `${scriptsPath}main.js`,
	browserSyncPath = 'http://localhost:8080'; // assumes local development is running with http-server


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
		.pipe(rename(`${outputCSSName}.css`))
		.pipe(sourcemaps.write(srcMapPath))
		.pipe(gulp.dest(outputPath))
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
		.pipe(rename(`${outputCSSName}.css`))
		.pipe(gulp.dest(outputPath));
});


// Conpile JS for development
gulp.task('js', function() {
	gulp.src(mainScript)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(rename(`${outputJSName}.js`))
		.pipe(sourcemaps.write(srcMapPath))
		.pipe(gulp.dest(outputPath))
		.pipe(browserSync.stream());
});


// Compile JS for production
gulp.task('buildjs', function () {
	gulp.src(mainScript)
		.pipe(babel())
		.pipe(minify({
			mangle: {
				keepClassName: true
			}
		}))
		.pipe(rename(`${outputJSName}.js`))
		.pipe(gulp.dest(outputPath));
});


// Watch asset folder for local development changes
gulp.task("watch", ["scss", "js"], function() {
	console.log('Starting dev server…\n');
	browserSync.init({
		proxy: browserSyncPath,  // assumes http-server is running @ default port
		open: false,
		notify: true,
		reloadOnRestart: true,
		ghostMode: false,
		scrollThrottle: 200
	});
	gulp.watch(`${stylesPath}**/*`, ["scss"]);
	gulp.watch(`${scriptsPath}**/*`, ["js"]);
});


// Clear development files for production
gulp.task("clean", function () {
	console.log('Deleting map files…\n');
	return del([`${srcMapPath}**/*.map`]);
});


// Minify images
gulp.task("minify_images", function() {
	gulp.src(`${imgPath}*`)
		.pipe(imagemin([], {
			verbose: true
		}))
		.pipe(gulp.dest(imgOutput));
});


// Build files for production
gulp.task("build", ["clean", "minify_images", "compress_scss", "buildjs"], function() {
	gulp.task(`${scriptsPath}**/*`, ["buildjs"]);
	gulp.task(mainStylesheet, ["compress_scss"]);
	console.log('Production build complete!\n');
});


// Set watch as default task
gulp.task("default", ["watch"]);

