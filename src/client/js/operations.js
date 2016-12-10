'use strict';

// Operations

const operations = {
  setColumns: function (cols) {
    return function (state) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.cols = cols;
      return newState;
    }
  },
  setSearch: function (search) {

  },
  addFilter: function (filterText) {
    return function (state) {
      const newState = JSON.parse(JSON.stringify(state));
      newState.filters.push(filterText);
      return newState;
    }
  }
}

module.exports = operations;