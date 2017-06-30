import assert from 'assert';
import Joi from 'joi';
import uuid from 'uuid';
import dynabrow from '../lib';

describe('Test', () => {
  it('should run', (done) => {
    const dyn = dynabrow({
      region: process.env.DDB_REGION || 'eu-west-1', // Your specific AWS Region
      endpoint: process.env.DDB_ENDPOINT || 'http://localhost:4567', // Optional value to specify an end point
      accessKeyId: process.env.DDB_ACCESS_KEY_ID || '123456789',
      secretAccessKey: process.env.DDB_SECRET_ACCESS_KEY || '123456789',
    });

    const TestModel = dyn.model({
      constructor() {
        this.id = uuid();
      },
      name: 'Restaurant',
      tableName: 'Restaurants',
      keySchema: {
        hash: {
          name: 'id',
          type: 'S',
        },
      },
      schema: {
        id: Joi.string().uuid(),
        name: Joi.string(),
        testObj: {
          test: Joi.string(),
        },
      },
    });

    const instance = new TestModel({
      name: 'hey',
      testObj: {
        test: 'hey',
      },
    });
    instance.insert()
    .then(() => {
      assert.equal(1, 2);
      done();
    });
  });
});
