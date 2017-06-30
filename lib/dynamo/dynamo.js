import dynamoDB from './dynamodb';

const parameterHelpers = require('./parameter-helpers');

class Dynamo {
  constructor(config) {
    this.adapterName = 'dynamo';
    this.adapter = dynamoDB(config);
  }
  createTable(params) {
    const parameters = parameterHelpers.createTable.bind(params)();
    return this.adapter.client.createTable(parameters).promise();
  }
  insert(params, object) {
    const parameters = parameterHelpers.put.bind(params)(object);
    return this.adapter.documentClient.put(parameters).promise()
    .then(() => object);
  }
  update(params, object, updatedFields) {
    if (Object.keys(updatedFields).length === 0) {
      return Promise.resolve({});
    }
    const parameters = parameterHelpers.update.bind(params)(object, updatedFields);
    return this.adapter.documentClient.update(parameters).promise();
  }
  delete(params, object) {
    const parameters = parameterHelpers.delete.bind(params)(object);
    return this.adapter.documentClient.delete(parameters).promise();
  }
  list(params, query) {
    const parameters = parameterHelpers.list.bind(params)(query);
    return this.adapter.documentClient.scan(parameters).promise()
      .then(result => result.Items);
  }
  findById(model, id) {
    const parameters = parameterHelpers.findById.bind(model)(id);
    return this.adapter.documentClient.get(parameters).promise()
    .then((result) => {
      if (!result.Item) {
        throw new Error('RecordNotFound');
      }
      return new this(result.Item);
    });
  }
}

export default Dynamo;
