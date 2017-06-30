'use strict';

const createTable = require('./createTable');
const put = require('./put');
const update = require('./update');
const list = require('./list');
const findById = require('./find-by-id');

module.exports = {
  createTable,
  put,
  update,
  list,
  findById,
};
