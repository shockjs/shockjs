var config = require('./dist/server/config/config');

module.exports = {

  development: config.getConfig('development', true).database,

  staging: config.getConfig('staging', true).database,

  production: config.getConfig('production', true).database

};
