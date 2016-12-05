'use strict';

const operations = {
  oneMoreColumn: {
    mutate: function (state) {
      console.log(state.cols)
      const newState = JSON.parse(JSON.stringify(state));
      newState.cols = state.cols + 1;
      return newState;
    },
    reverseMutate: function (newState) {
      const prevState = JSON.parse(JSON.stringify(newState));
      prevState.cols = newState.cols - 1;
      return prevState;
    }
  },
  setColumns: function (cols) {
    const op = {
      mutate: function (state) {
        const newState = JSON.parse(JSON.stringify(state));
        newState.cols = cols;
        op.reverseMutate = function (newState) {
          const prevState = JSON.parse(JSON.stringify(newState));
          prevState.cols = state.cols;
          return prevState;
        }
        return newState;
      },
      reverseMutate: function (newState) {
        throw new Error("Can't reverse mutation without defining mutation.");
      }
    }
    return op;
  }
}

module.exports = operations;