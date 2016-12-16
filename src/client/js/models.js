'use strict';

// Application State

const model = {
  title: 'Welcome to the notebook',
};

const state = {
};

const data = {
  model,
  state
};

const modelOperationsQueue = [];
const stateOperationsQueue = [];

const stateHistory = [];

module.exports = {
  data,
  modelOperationsQueue,
  stateOperationsQueue,
  stateHistory
};
