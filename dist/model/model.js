'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Promise = require('bluebird');
var Joi = require('joi');

function assign() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  Array.from(args).reduce(function (prev, next) {
    if (next === undefined || next === null) {
      return prev;
    }
    Object.keys(next).forEach(function (key) {
      prev[key] = next[key]; // eslint-disable-line no-param-reassign
    });
    return prev;
  });
}

function checkUpdatedFields(target, compare) {
  return Object.keys(target).reduce(function (obj, key) {
    if (!target || Object.prototype.hasOwnProperty.call(target, key) && (_typeof(target[key]) !== 'object' || Array.isArray(target[key]) && JSON.stringify(target[key]) !== JSON.stringify(compare[key])) && compare && compare[key] && (!target[key] || target[key] !== compare[key])) {
      obj[key] = compare[key]; // eslint-disable-line no-param-reassign
    } else if (Object.prototype.hasOwnProperty.call(target, key) && _typeof(target[key]) === 'object' && !Array.isArray(target[key])) {
      var nestedUpdatedFields = checkUpdatedFields(target[key], compare[key]);
      if (Object.keys(nestedUpdatedFields).length > 0) {
        obj[key] = nestedUpdatedFields; // eslint-disable-line no-param-reassign
      }
    }
    return obj;
  }, {});
}

var registeredModels = {};

var Model = function Model(config) {
  var params = config;
  params.adapter = params.adapter || Model.defaultAdapter;
  if (!params.adapter) {
    throw new Error('Please, specify the adapter for the model or specify a global adapter on Model.defaultAdapter');
  }

  params.autoValidate = true;

  var originalState = {};

  var model = function model(data) {
    params.constructor.bind(this)(data);
    assign(this, data);
    assign(originalState, JSON.parse(JSON.stringify(this))); // deep clone.
  };

  model.prototype = {
    params: params,
    insert: function insert() {
      var _this = this;

      var promise = void 0;
      if (params.autoValidate) {
        promise = this.validate();
      } else {
        promise = Promise.resolve();
      }
      return promise.then(function () {
        return params.adapter.insert.bind(params)(_this);
      });
    },
    save: function save(body) {
      var _this2 = this;

      var promise = void 0;
      if (params.autoValidate) {
        promise = this.validate();
      } else {
        promise = Promise.resolve();
      }
      if (body) {
        assign(this, body);
      }
      var updatedFields = this.updatedFields();
      return promise.then(function () {
        return params.adapter.update.bind(params)(_this2, updatedFields);
      }).then(function (result) {
        assign(_this2, originalState);
        return result;
      });
    },
    updatedFields: function updatedFields() {
      return checkUpdatedFields(originalState, this);
    },
    validate: function validate() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        Joi.validate(_this3, params.schema, function (error, result) {
          if (error) {
            return reject(error);
          }
          return resolve(result, params.schema);
        });
      });
    },
    validateSync: function validateSync() {
      return Joi.validate(this);
    }
  };

  model.prototype.constructor = model;

  model.params = config;

  model.createTable = function createTable() {
    return params.adapter.createTable.bind(params)();
  };

  model.list = function list() {
    return params.adapter.list.bind(params)();
  };

  model.find = function find() {
    return params.adapter.find.bind(params)();
  };

  model.findById = function findById(id) {
    return params.adapter.findById.bind(model)(id);
  };

  model.findOne = function findOne() {
    return params.adapter.findOne.bind(params)();
  };

  registeredModels[params.name] = model;

  return model;
};

Model.setupTables = function () {
  return Promise.all(Object.keys(registeredModels).map(function (key) {
    return registeredModels[key].createTable();
  }));
};

module.exports = Model;