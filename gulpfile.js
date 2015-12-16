const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const wait = require('gulp-wait');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const nodemon = require('gulp-nodemon');
const webpack = require('webpack');
const webpackConfig = require("./webpack.js");
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const Knex = require("knex");
const knexfile = require("./knexfile");
const knex = Knex(knexfile[process.env.SHOCK_ENV || 'development']);

/**
 *  Cleans up dist folder.
 */
gulp.task('clean:dist', function () {
  return del([
    'dist/**/*',
    '!dist/.gitignore'
  ]);
});

/**
 *  Moves all non-js files to dist folder.
 */
gulp.task('move:dist', function() {
  return gulp.src('src/**/!(*.js)')
    .pipe(gulp.dest('./dist'));
});

/**
 * Moves all js files, converts to es5 and moves to dist folder.
 */
gulp.task('build:dist', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ["es2015", "react", "stage-0"],
      plugins: ["syntax-jsx"]
    }))
    .pipe(gulp.dest('dist'));
});

/**
 * watches for javascript changes in src and converts changes to es5 into dist.
 */
gulp.task('watch:babel', function () {
  return watch('src/**/*.js', batch(function (events, done) {
      gutil.log('running babel...');
      events
      .pipe(babel({
        presets: ["es2015", "react", "stage-0"],
        plugins: ["syntax-jsx"]
      }))
      .pipe(gulp.dest('dist'))
      .pipe(done);
  }));
});

/**
 * Watches all non-js files and copies into dist.
 */
gulp.task('watch:other', function() {
  return watch('src/**/*(*.json|*.jsx|!(*.js))', batch(function (events, done) {
    gutil.log('copying files...');
    events
      .pipe(gulp.dest('dist'))
      .pipe(done);
  }));
});

/**
 * Restarts node on script change in server.
 */
gulp.task('run:nodemon', function () {
  return nodemon({
    cwd: './dist/server',
    script: 'index.js',
    ext: 'html js'
  })
  .on('restart', function () {
    console.log('restarted node after change...')
  })
});

/**
 * Builds bundle.js for use on the client.
 */
gulp.task('run:webpack', function (callback) {
  gutil.log('building webpack...');
  return webpack(webpackConfig, function (err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

/**
 * Rebuilds bundle.js when files change for client.
 */
gulp.task('watch:webpack', function(callback) {
  return watch('dist/(client|shared)/*.js', batch(function (events, done) {
    events.pipe(
      gulp.start('run:webpack')
    ).pipe(done);
  }));
});

/**
 * Runs migrations
 */
gulp.task('migrate', function () {
  if (argv.down) {
    return knex.migrate.rollback()
        .then(function (version) {
          console.log("migrated database down to version: " + version[0]);
          knex.destroy();
        })
        .catch(function (err) {
          console.error(err);
          knex.destroy();
        });;
  } else {
    return knex.migrate.latest()
        .then(function () {
          return knex.migrate.currentVersion();
        })
        .then(function (version) {
          console.log("migrated database up to version: " + version);
          knex.destroy();
        })
        .catch(function (err) {
          console.error(err);
          knex.destroy();
        });
  }
});

/**
 * Compiles everything and watches for changes for faster development.
 */
gulp.task('default', function(callback) {
  runSequence('clean:dist', 'move:dist', 'build:dist', 'run:webpack', ['watch:babel', 'watch:other', 'run:nodemon'], function() {
    callback();
  });
});

/**
 * Compiles everything.
 */
gulp.task('compile', function(callback) {
  runSequence('clean:dist', 'move:dist', 'build:dist', 'run:webpack', function() {
    callback();
  });
});