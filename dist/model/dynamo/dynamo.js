'use strict';

var dynamoDB = require('../../../utilities/database/dynamodb');
var parameterHelpers = require('./parameter-helpers');

var Dynamo = {
  adapterName: 'dynamo',
  createTable: function createTable() {
    var params = parameterHelpers.createTable.bind(this)();
    return dynamoDB.client.createTable(params).promise();
  },
  insert: function insert(object) {
    var params = parameterHelpers.put.bind(this)(object);
    return dynamoDB.documentClient.put(params).promise().then(function () {
      return object;
    });
  },
  update: function update(object, updatedFields) {
    if (Object.keys(updatedFields).length === 0) {
      return Promise.resolve({});
    }
    var params = parameterHelpers.update.bind(this)(object, updatedFields);
    return dynamoDB.documentClient.update(params).promise();
  },
  delete: function _delete(object) {
    var params = parameterHelpers.delete.bind(this)(object);
    return dynamoDB.documentClient.delete(params).promise();
  },
  list: function list(query) {
    var params = parameterHelpers.list.bind(this)(query);
    return dynamoDB.documentClient.scan(params).promise().then(function (result) {
      return result.Items;
    });
  },
  findById: function findById(id) {
    var _this = this;

    var params = parameterHelpers.findById.bind(this.config)(id);
    return dynamoDB.documentClient.get(params).promise().then(function (result) {
      if (!result.Item) {
        throw new Error('RecordNotFound');
      }
      return new _this(result.Item);
    });
  }
};

module.exports = Dynamo;