'use strict';

var Support = require(__dirname + '/../support')
  , testsql = Support.testsql
  , current = Support.sequelize
  , sql     = current.dialect.QueryGenerator;

Support.noDatabase = true;

suite('SQL', function() {
  suite('whereQuery', function () {
    test('{}', function () {
      testsql(sql.whereQuery({}), {
        default: ''
      });
    });
    test('[]', function () {
      testsql(sql.whereQuery({}), {
        default: ''
      });
    });
    test('{id: 1}', function () {
      testsql(sql.whereQuery({id: 1}), {
        default: 'WHERE `id` = 1',
        postgres: 'WHERE "id" = 1',
      });
    });
  });

  suite('whereItemQuery', function () {

  });
});