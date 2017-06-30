const Promise = require('bluebird');
const Joi = require('joi');

function assign(...args) {
  Array.from(args).reduce((prev, next) => {
    if (next === undefined || next === null) {
      return prev;
    }
    Object.keys(next).forEach((key) => {
      prev[key] = next[key]; // eslint-disable-line no-param-reassign
    });
    return prev;
  });
}

function checkUpdatedFields(target, compare) {
  return Object.keys(target).reduce((obj, key) => {
    if (!target || (Object.prototype.hasOwnProperty.call(target, key)
    && (typeof (target[key]) !== 'object' || (Array.isArray(target[key]) && JSON.stringify(target[key]) !== JSON.stringify(compare[key])))
    && (compare && compare[key] && (!target[key] || target[key] !== compare[key])))) {
      obj[key] = compare[key]; // eslint-disable-line no-param-reassign
    } else if (Object.prototype.hasOwnProperty.call(target, key)
    && typeof (target[key]) === 'object' && !Array.isArray(target[key])) {
      const nestedUpdatedFields = checkUpdatedFields(target[key], compare[key]);
      if (Object.keys(nestedUpdatedFields).length > 0) {
        obj[key] = nestedUpdatedFields; // eslint-disable-line no-param-reassign
      }
    }
    return obj;
  }, {});
}

const registeredModels = {};

const Model = function Model(config) {
  const params = config;
  params.adapter = params.adapter || Model.defaultAdapter;
  if (!params.adapter) {
    throw new Error('Please, specify the adapter for the model or specify a global adapter on Model.defaultAdapter');
  }

  params.autoValidate = true;

  const originalState = {};

  const model = function model(data) {
    params.constructor.bind(this)(data);
    assign(this, data);
    assign(originalState, JSON.parse(JSON.stringify(this))); // deep clone.
  };

  model.prototype = {
    params,
    insert() {
      let promise;
      if (params.autoValidate) {
        promise = this.validate();
      } else {
        promise = Promise.resolve();
      }
      return promise
        .then(() => params.adapter.insert(params, this));
    },
    save(body) {
      let promise;
      if (params.autoValidate) {
        promise = this.validate();
      } else {
        promise = Promise.resolve();
      }
      if (body) {
        assign(this, body);
      }
      const updatedFields = this.updatedFields();
      return promise
        .then(() => params.adapter.update(params, this, updatedFields))
        .then((result) => {
          assign(this, originalState);
          return result;
        });
    },
    updatedFields() {
      return checkUpdatedFields(originalState, this);
    },
    validate() {
      return new Promise((resolve, reject) => {
        Joi.validate(this, params.schema, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result, params.schema);
        });
      });
    },
    validateSync() {
      return Joi.validate(this);
    },
  };

  model.prototype.constructor = model;

  model.params = config;

  model.createTable = function createTable() {
    return params.adapter.createTable(params);
  };

  model.list = function list() {
    return params.adapter.list(params);
  };

  model.find = function find() {
    return params.adapter.find(params);
  };

  model.findById = function findById(id) {
    return params.adapter.findById(model, id);
  };

  model.findOne = function findOne() {
    return params.adapter.findOne(params);
  };

  registeredModels[params.name] = model;

  return model;
};

Model.setupTables = () => Promise.all(Object.keys(registeredModels)
  .map(key => registeredModels[key].createTable()));

module.exports = Model;
