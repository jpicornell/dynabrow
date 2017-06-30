'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function findById(id) {
  var params = {
    TableName: this.tableName,
    Key: _defineProperty({}, this.keySchema.hash.name, id)
  };

  return params;
};