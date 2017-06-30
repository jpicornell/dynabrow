'use strict';

const QueryBuilder = function QueryBuilder(config) {
  this.adapter = config.adapter;
};


QueryBuilder.prototype = {
  whereBuild(query) {
    const equality = Object.keys(query).reduce((prev, next) => `${prev} field = ${query[next]}`, '');
    return equality !== '' ? equality : undefined;
  },
};

QueryBuilder.constructor = QueryBuilder;

module.exports = QueryBuilder;
