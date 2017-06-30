'use strict';

function plainObject(object, pathParam) {
  let path = '';
  if (pathParam) {
    path = pathParam;
  }
  return Object.keys(object).reduce((prev, next) => {
    if (typeof object[next] !== 'object' || Array.isArray(object[next])) {
      prev[path + next] = object[next];
      return prev;
    }
    const plainObj = plainObject(object[next], `${path}${next}.`);
    Object.keys(plainObj).forEach((key) => {
      prev[key] = plainObj[key];
    });
    return prev;
  }, {});
}

function dynamoMapAttributes(object) {
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  const plained = plainObject(object);
  const mapStrings = Object.keys(plained).map((key, index) => {
    const attributes = {};
    key.split('.').forEach((k, i) => {
      expressionAttributeNames[`#${index}i${i}`] = k;
      attributes[`#${index}i${i}`] = k;
    });
    expressionAttributeValues[`:${index}`] = plained[key];

    return `${Object.keys(attributes).join('.')} = :${index}`;
  });
  return {
    updateExpression: mapStrings.join(', '),
    expressionAttributeNames,
    expressionAttributeValues,
  };
}

module.exports = function update(instance, updatedFields) {
  if (!this.keySchema || !this.keySchema.hash || !instance[this.keySchema.hash.name]) {
    throw new Error(`There is no schema or the key id for ${this.tableName} is not set `);
  }

  const mapAttributes = dynamoMapAttributes(updatedFields);
  const params = {
    TableName: this.tableName,
    Key: {
      [this.keySchema.hash.name]: instance[this.keySchema.hash.name],
    },
    UpdateExpression: `set ${mapAttributes.updateExpression}`,
    ExpressionAttributeNames: mapAttributes.expressionAttributeNames,
    ExpressionAttributeValues: mapAttributes.expressionAttributeValues,
  };
  return params;
};
