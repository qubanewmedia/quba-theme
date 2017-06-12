const gulp = require('gulp');
const sass = require('gulp-sass');
const sassGlob = require("gulp-sass-glob");
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const bemLinter = require('postcss-bem-linter');
const cssnano = require('cssnano');
const gulpStylelint = require('gulp-stylelint');
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();
const data = require('gulp-data');
const browserify = require('browserify');
const eslint = require('gulp-eslint');
const fs = require('fs');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// Nunjuck templating, for static site generation
gulp.task('nunjucks', () => {
  // Gets .html files in the src folder that don't start with underscore
  gulp.src('./src/pages/**/!(_)*.html')
  // Adding data to Nunjucks
  .pipe(data(function (file) {
    return JSON.parse(fs.readFileSync(`${file.path}.json`));
  }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
    path: './src/components',
  }))
  // output files in dist folder
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream());
});

// Lint scss
gulp.task('lint-scss', () => {
  gulp.src([
    './src/assets/scss/**/*.scss',
    './src/components/**/*.scss',
  ])
  .pipe(gulpStylelint({
    syntax: 'scss',
    reporters: [{
      formatter: 'string',
      console: true,
    }],
  }));
});

// Compile scss
gulp.task('sass', () => {
  gulp.src('./src/assets/scss/**/*.scss')
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    bemLinter('suit'),
    autoprefixer({ browsers: [
      'last 2 version',
      '> 1%',
      'ie 9',
    ] }),
    cssnano(),
  ]))
  .pipe(rename('main.min.css'))
  .pipe(gulp.dest('./dist/assets/css'))
  .pipe(browserSync.stream());
});

// Transfer images from src to dist
gulp.task('images', () => {
  gulp.src([
    './src/assets/img/**/*.{jpg,png,svg}',
  ])
  .pipe(gulp.dest('./dist/assets/img'))
  .pipe(browserSync.stream());
});

// Transfer fonts from src to dist
gulp.task('fonts', () => {
  gulp.src(['./src/assets/fonts/**/*.{woff,woff2,otf,ttf}'])
  .pipe(gulp.dest('./dist/assets/fonts'))
  .pipe(browserSync.stream());
});

// Transfer video from src to dist
gulp.task('video', () => {
  gulp.src(['./src/assets/video/*.{mp4,webm}'])
  .pipe(gulp.dest('./dist/assets/video'))
  .pipe(browserSync.stream());
});

// Lint JS
gulp.task('lint-js', () => {
  gulp.src([
    './src/assets/js/*.js',
    './src/components/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

// Browserify
gulp.task('browserify', ['lint-js'], () => {
  browserify({ debug: true })
  // return browserify('./src/_assets/js/main.js')
  .transform('babelify')
  .require('./src/assets/js/main.js', { entry: true })
  .bundle()
  .on('error', (err) => { console.log(`Error: ${err.message}`); })
  .pipe(source('main.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/assets/js'))
  .pipe(browserSync.stream());
});

// Move misc files from src to dist
gulp.task('misc', () => {
  const miscFiles = ([
    './src/.htaccess',
    './src/favicon.ico',
  ]);
  gulp.src(miscFiles)
  .pipe(gulp.dest('./dist'));
});



// Serve and watch folders
gulp.task('serve', [
  'nunjucks',
  'sass',
  'images',
  'video',
  'fonts',
  'browserify',
  'misc',
], () => {
  browserSync.init({
    server: './dist',
  });

  gulp.watch([
    './src/**/*.html',
    './src/**/*.html.json',
  ], ['nunjucks']);

  gulp.watch([
    './src/assets/scss/**/*.scss',
    './src/components/**/*.scss',
  ], ['sass']);

  gulp.watch([
    './src/assets/img/**/*.*',
  ], ['images']);

  gulp.watch([
    './src/assets/video/**/*.*',
  ], ['video']);

  gulp.watch([
    './src/assets/fonts/*.*',
  ], ['fonts']);

  gulp.watch([
    './src/assets/js/*.js',
    './src/components/**/*.js',
  ], ['browserify']);
});

gulp.task('build', [
  'nunjucks',
  'sass',
  'images',
  'video',
  'fonts',
  'browserify',
  'misc',
]);

gulp.task('default', ['serve']);
