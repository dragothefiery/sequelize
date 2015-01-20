'use strict';

var fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , Sequelize = require(__dirname + '/../../index')
  , DataTypes = require(__dirname + '/../../lib/data-types')
  , Config = require(__dirname + '/config/config')
  , chai = require('chai')
  , expect = chai.expect
  , chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// Make sure errors get thrown when testing
Sequelize.Promise.onPossiblyUnhandledRejection(function(e, promise) {
  throw e;
});
Sequelize.Promise.longStackTraces();

var Support = {
  Sequelize: Sequelize,

  createSequelizeInstance: function(options) {
    options = options || {};
    options.dialect = this.getTestDialect();

    var config = Config[options.dialect];

    var sequelizeOptions = _.defaults(options, {
      host: options.host || config.host,
      logging: (process.env.SEQ_LOG ? console.log : false),
      dialect: options.dialect,
      port: options.port || process.env.SEQ_PORT || config.port,
      pool: config.pool,
      dialectOptions: options.dialectOptions || {}
    });

    if (process.env.DIALECT === 'postgres-native') {
      sequelizeOptions.native = true;
    }

    if (!!config.storage) {
      sequelizeOptions.storage = config.storage;
    }

    return this.getSequelizeInstance(config.database, config.username, config.password, sequelizeOptions);
  },

  getSequelizeInstance: function(db, user, pass, options) {
    options = options || {};
    options.dialect = options.dialect || this.getTestDialect();
    return new Sequelize(db, user, pass, options);
  },

  getSupportedDialects: function() {
    return fs.readdirSync(__dirname + '/../../lib/dialects').filter(function(file) {
      return ((file.indexOf('.js') === -1) && (file.indexOf('abstract') === -1));
    });
  },

  getTestDialect: function() {
    var envDialect = process.env.DIALECT || 'mysql';

    if (envDialect === 'postgres-native') {
      envDialect = 'postgres';
    }

    if (this.getSupportedDialects().indexOf(envDialect) === -1) {
      throw new Error('The dialect you have passed is unknown. Did you really mean: ' + envDialect);
    }

    return envDialect;
  },

  getTestUrl: function(config) {
    var url,
        dbConfig = config[config.dialect];

    if (config.dialect === 'sqlite') {
      url = 'sqlite://' + dbConfig.storage;
    } else {

      var credentials = dbConfig.username;
      if (dbConfig.password) {
        credentials += ':' + dbConfig.password;
      }

      url = config.dialect + '://' + credentials
      + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database;
    }
    return url;
  },

  expectsql: function(query, expectations) {
    var expectation = expectations[Support.sequelize.dialect.name] || expectations['default'];
    expect(query).to.equal(expectation);
  }
};

var sequelize = Support.sequelize = Support.createSequelizeInstance();


beforeEach(function() {
  this.sequelize = sequelize;
});


module.exports = Support;
