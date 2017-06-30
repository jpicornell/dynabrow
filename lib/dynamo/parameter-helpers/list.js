'use strict';

const QueryBuilder = require('../query-builder');

module.exports = function list(queryParam) {
  const queryBuilder = new QueryBuilder(this);
  let query = {};
  if (queryParam) {
    query = queryParam;
  }

  const params = {
    TableName: this.tableName,
    ProjectionExpression: query.fields && query.fields.join(', '),
    FilterExpression: queryBuilder.whereBuild(query),
  };

  return params;
};
