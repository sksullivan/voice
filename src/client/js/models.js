'use strict';

// Application State

const model = {
  title: 'Formant Analysis',
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
