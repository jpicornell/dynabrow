'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dynamoConfig = {
  region: process.env.DDB_REGION || 'eu-west-1', // Your specific AWS Region
  endpoint: process.env.DDB_ENDPOINT || 'http://localhost:4567', // Optional value to specify an end point
  accessKeyId: process.env.DDB_ACCESS_KEY_ID || '123456789',
  secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY || '123456789'
};

_awsSdk2.default.config.update(dynamoConfig);

exports.default = function (config) {
  _awsSdk2.default.config.update(config);
  return {
    client: new _awsSdk2.default.DynamoDB(),
    documentClient: new _awsSdk2.default.DynamoDB.DocumentClient()
  };
};