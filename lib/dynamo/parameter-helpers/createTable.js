'use strict';

module.exports = function createTable() {
  const params = {
    TableName: this.tableName,
    KeySchema: [],
    AttributeDefinitions: [],
  };
  if (this.keySchema && this.keySchema.hash) {
    params.KeySchema.push({
      AttributeName: this.keySchema.hash.name,
      KeyType: 'HASH',
    });
    params.AttributeDefinitions.push({
      AttributeName: this.keySchema.hash.name,
      AttributeType: this.keySchema.hash.type,
    });
  }

  if (this.keySchema && this.keySchema.range) {
    params.KeySchema.push({
      AttributeName: this.keySchema.range.name,
      KeyType: 'RANGE',
    });
    params.AttributeDefinitions.push({
      AttributeName: this.keySchema.range.name,
      AttributeType: this.keySchema.range.type,
    });
  }
  params.ProvisionedThroughput = {
    ReadCapacityUnits: (this.throughput && this.throughput.read) || 10,
    WriteCapacityUnits: (this.throughput && this.throughput.write) || 10,
  };
  return params;
};
