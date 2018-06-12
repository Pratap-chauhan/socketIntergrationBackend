const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const server = require('gulp-develop-server');
const cache = require('gulp-cached');

const source = ['src/**/*.ts'];
const dontWatchMe = [];

gulp.task('ts', () => {
  return gulp
    .src(source, { base: './src' })
    .pipe(cache('typescript'))
    .pipe(ts({ module: 'commonjs', noImplicitAny: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
  return gulp
    .src(['./**/*.map.js', './**/*.js.map', 'dist'], { read: false })
    .pipe(clean());
});

gulp.task('server:start', ['ts'], () => {
  server.listen({ path: `${process.cwd()}/dist/Server` }, (error) => {
    if (error) {
      console.log(error);
    }
  });
});

gulp.task('server:restart', ['ts'], () => {
  server.restart();
});

gulp.task('default', ['server:start'], () => {
  const watch = source.concat(dontWatchMe);
  console.log({ watch });
  gulp.watch(watch, ['server:restart'], () => {
    console.log('Watching ... ');
  });
});
