'use strict';

var QueryBuilder = function QueryBuilder(config) {
  this.adapter = config.adapter;
};

QueryBuilder.prototype = {
  whereBuild: function whereBuild(query) {
    var equality = Object.keys(query).reduce(function (prev, next) {
      return prev + ' field = ' + query[next];
    }, '');
    return equality !== '' ? equality : undefined;
  }
};

QueryBuilder.constructor = QueryBuilder;

module.exports = QueryBuilder;