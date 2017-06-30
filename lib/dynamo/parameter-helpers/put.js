'use script';

module.exports = function put(object) {
  const params = {
    TableName: this.tableName,
    Item: object,
  };
  return params;
};
