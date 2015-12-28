"use strict";

const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');
const wait = require('gulp-wait');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require("./webpack.js");
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const Knex = require("knex");
const bcrypt = require("bcrypt");
const inquirer = require("inquirer");
const pm2 = require('pm2');

/**
 * Creates a super user.
 */
gulp.task('user', (end) => {

  const User = require('./dist/server/models/User').default;

  if (argv.create) {
    inquirer.prompt([
        {
          type: 'input', name: 'firstName', message: 'Enter firstName:'
        },
        {
          type: 'input', name: 'lastName', message: 'Enter lastName:'
        },
        {
          type: 'input', name: 'username', message: 'Enter username:'
        },
        {
          type: 'input', name: 'email', message: 'Enter email:'
        },
        {
          type: 'password', name: 'password', message: 'Enter password:'
        },
        {
          type: 'confirm', name: 'moveon', message: 'Continue?'
        }
      ],
      (answers) => {

        if (!answers.moveon) {
          end();
          process.exit(1); //Need to destroy otherwise hang.
        } else {
          const AuthManager = require('./dist/server/classes/AuthManager').default;
          const auth = new AuthManager(User.knex());
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(answers.password, salt, (err, hash) => {
              new User({
                firstName: answers.firstName || 'Super',
                lastName: answers.lastName || 'User',
                username: answers.username,
                email: answers.email,
                password: hash,
                salt: salt,
                active: 1
              })
                .save()
                .then((model) => {
                  return auth.assignRole('admin', model.attributes.id);
                })
                .then(() => {
                  User.knex().destroy();
                  end();
                  process.exit(1); //Need to destroy otherwise hang.
                });
            });
          });
        }
      });
  }
});

/**
 * Runs migrations e.g "gulp migrate", "gulp migrate --down" or "gulp migrate --create=user"
 */
gulp.task('migrate', function () {

  const knexfile = require("./knexfile");

  //Get our environment
  const knex = Knex(knexfile[process.env.SHOCK_ENV || 'development']);

  if (argv.down) {
    return knex.migrate.rollback()
      .then((version) => {
        gutil.log('[migration]', "dropped to version: " + version[0]);
        knex.destroy();
      })
      .catch((err) => {
        gutil.log('[migration]', err);
        knex.destroy();
      });
  } else if (argv.create) {
    return knex.migrate.make(argv.create)
      .then((name) => {
        gutil.log('[migration]', "created migration named " + name);
        knex.destroy();
      })
      .catch((err) => {
        gutil.log('[migration]', err);
        knex.destroy();
      });
  } else {
    return knex.migrate.latest()
      .then(function () {
        return knex.migrate.currentVersion();
      })
      .then((version) => {
        gutil.log('[migration]', "upped to version: " + version);
        knex.destroy();
      })
      .catch((err) => {
        gutil.log('[migration]', err);
        knex.destroy();
      });
  }
});

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
 * Builds bundle.js for use on the client.
 */
gulp.task('build:webpack', function () {
  gutil.log('[webpack]', 'building webpack...');
  return webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }
    gutil.log("[webpack]", `hash: ${stats.hash}`);
  });
});

/**
 * Restarts node on script change in server.
 */
gulp.task('run:pm2', (cb) => {

  pm2.launchBus((err, bus) => {
    bus.on('log:out', function (data) {
      gutil.log("[pm2]", data.data);
    });
    bus.on('log:err', function (data) {
      gutil.error("[pm2]", data.data);
    });
  });

  pm2.connect(() => {
    pm2.restart('dist/server/index.js', (err) => {

      if (err) {
        gutil.log("[compilation]", err);
        cb();
        return false;
      }

      gutil.log("[compilation]", `server started..`);
      return cb();
    });
  })
});

/**
 * Checks if we should run the file through babel or not.
 */
const runBabel = file => file.relative.match(/\.js(x)?$/) !== null;

/**
 * Check if we need to run webpack.
 */
const runWebpack = file => file.relative.match(/(client|shared)\/.+\.js(x)?$/) !== null;

/**
 * Watches all files in src, copies and compiles in dest.
 */
gulp.task('watch:changes', function() {

  return watch('src/**/*', batch({ timeout: 1000 }, (events, cb) => {

    // @todo Private variable should be replaced with something public.
    let runWebpackAfter = events._list.filter((file) => {
      return runWebpack(file);
    }).length > 0;

    gutil.log('[webpack]', `compile: ${runWebpackAfter}`);

    gutil.log('[compilation]', 'change detected..');
    events
      .pipe(gulpif(runBabel, babel({
        presets: ["es2015", "react", "stage-0"],
        plugins: ["syntax-jsx"]
      })))
      .pipe(gulp.dest('dist'))
      .on('end', () => {
        // Do we need to re-run webpack
        if (runWebpackAfter) {
          webpack(webpackConfig, (err, stats) => {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", `hash: ${stats.hash}`);
            gutil.log('[compilation]', 'restarting application..');
            pm2.restart('dist/server/index.js', () => {
              gutil.log('[compilation]', 'completed.');
            });
            cb();
          });
        } else {
          gutil.log('[compilation]', 'restarting application..');
          pm2.restart('dist/server/index.js', () => {
            gutil.log('[compilation]', 'completed.');
          });
          cb();
        }
      });

  }));
});

/**
 * Compiles everything.
 */
gulp.task('compile', (callback) => {
  runSequence('clean:dist', 'move:dist', 'build:dist', 'build:webpack', function() {
    callback();
  });
});

/**
 * Compiles everything and watches for changes for faster development.
 */
gulp.task('default', (callback) => {
  runSequence('compile', 'run:pm2', ['watch:changes'], function() {
    callback();
  });
});