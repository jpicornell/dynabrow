'use strict';

var QueryBuilder = require('../../query-builder');

module.exports = function list(queryParam) {
  var queryBuilder = new QueryBuilder(this);
  var query = {};
  if (queryParam) {
    query = queryParam;
  }

  var params = {
    TableName: this.tableName,
    ProjectionExpression: query.fields && query.fields.join(', '),
    FilterExpression: queryBuilder.whereBuild(query)
  };

  return params;
};