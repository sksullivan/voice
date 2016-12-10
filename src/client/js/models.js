'use strict';

// Application State

const model = {
  title: 'Welcome to the notebook',
  cols: 1,
  filters: [],
  search: "",
  notes: []
};

const state = {
  hiddenTags: [],
  collapsedNotes: [],
  filters: [],
  search: "",
  cols: 1
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
