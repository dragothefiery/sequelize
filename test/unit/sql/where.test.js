'use strict';

var Support   = require(__dirname + '/../support')
  , util      = require('util')
  , expectsql = Support.expectsql
  , current   = Support.sequelize
  , sql       = current.dialect.QueryGenerator;

Support.noDatabase = true;

suite('SQL', function() {
  suite('whereQuery', function () {
    var testsql = function (params, expectation) {
      test(util.inspect(params), function () {
        return expectsql(sql.whereQuery(params), expectation);
      });
    };

    testsql({}, {
      default: ''
    });
    testsql([], {
      default: ''
    });
    testsql({id: 1}, {
      default: 'WHERE `id` = 1',
      postgres: 'WHERE "id" = 1',
    });
  });

  suite('whereItemQuery', function () {
    var testsql = function (key, value, expectation) {
      test(key+": "+util.inspect(value), function () {
        return expectsql(sql.whereItemQuery(key, value), expectation);
      });
    };

    testsql('email', {
      $or: ['maker@mhansen.io', 'janzeh@gmail.com']
    }, {
      default: "(`email` = 'maker@mhansen.io' OR `email` = 'janzeh@gmail.com')"
    });

    testsql('$or', [
      {email: 'maker@mhansen.io'},
      {email: 'janzeh@gmail.com'}
    ], {
      default: "(`email` = 'maker@mhansen.io' OR `email` = 'janzeh@gmail.com')"
    });

    testsql('$or', {
      email: 'maker@mhansen.io',
      name: 'Mick Hansen'
    }, {
      default: "(`email` = 'maker@mhansen.io' OR `name` = 'Mick Hansen')"
    });
  });
});