'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function plainObject(object, pathParam) {
  var path = '';
  if (pathParam) {
    path = pathParam;
  }
  return Object.keys(object).reduce(function (prev, next) {
    if (_typeof(object[next]) !== 'object' || Array.isArray(object[next])) {
      prev[path + next] = object[next];
      return prev;
    }
    var plainObj = plainObject(object[next], '' + path + next + '.');
    Object.keys(plainObj).forEach(function (key) {
      prev[key] = plainObj[key];
    });
    return prev;
  }, {});
}

function dynamoMapAttributes(object) {
  var expressionAttributeNames = {};
  var expressionAttributeValues = {};
  var plained = plainObject(object);
  var mapStrings = Object.keys(plained).map(function (key, index) {
    var attributes = {};
    key.split('.').forEach(function (k, i) {
      expressionAttributeNames['#' + index + 'i' + i] = k;
      attributes['#' + index + 'i' + i] = k;
    });
    expressionAttributeValues[':' + index] = plained[key];

    return Object.keys(attributes).join('.') + ' = :' + index;
  });
  return {
    updateExpression: mapStrings.join(', '),
    expressionAttributeNames: expressionAttributeNames,
    expressionAttributeValues: expressionAttributeValues
  };
}

module.exports = function update(instance, updatedFields) {
  if (!this.keySchema || !this.keySchema.hash || !instance[this.keySchema.hash.name]) {
    throw new Error('There is no schema or the key id for ' + this.tableName + ' is not set ');
  }

  var mapAttributes = dynamoMapAttributes(updatedFields);
  var params = {
    TableName: this.tableName,
    Key: _defineProperty({}, this.keySchema.hash.name, instance[this.keySchema.hash.name]),
    UpdateExpression: 'set ' + mapAttributes.updateExpression,
    ExpressionAttributeNames: mapAttributes.expressionAttributeNames,
    ExpressionAttributeValues: mapAttributes.expressionAttributeValues
  };
  return params;
};