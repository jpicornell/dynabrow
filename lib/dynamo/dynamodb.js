import AWS from 'aws-sdk';

const dynamoConfig = {
  region: process.env.DDB_REGION || 'eu-west-1', // Your specific AWS Region
  endpoint: process.env.DDB_ENDPOINT || 'http://localhost:4567', // Optional value to specify an end point
  accessKeyId: process.env.DDB_ACCESS_KEY_ID || '123456789',
  secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY || '123456789',
};

AWS.config.update(dynamoConfig);

export default (config) => {
  AWS.config.update(config);
  return {
    client: new AWS.DynamoDB(),
    documentClient: new AWS.DynamoDB.DocumentClient(),
  };
};
