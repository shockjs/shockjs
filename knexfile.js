var config = require('./dist/server/config/index');

module.exports = {

  development: config.getDatabase('development', true),

  staging: config.getDatabase('staging', true),

  production: config.getDatabase('production', true)

};
