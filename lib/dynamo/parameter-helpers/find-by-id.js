'use strict';

module.exports = function findById(id) {
  const params = {
    TableName: this.tableName,
    Key: {
      [this.keySchema.hash.name]: id,
    },
  };

  return params;
};
