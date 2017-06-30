'use strict';
'use script';

module.exports = function put(object) {
  var params = {
    TableName: this.tableName,
    Item: object
  };
  return params;
};