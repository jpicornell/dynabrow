'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dynamo = require('./dynamo');

var _dynamo2 = _interopRequireDefault(_dynamo);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  _dynamo2.default.config = config;
  return { client: _dynamo2.default, model: _model2.default };
};