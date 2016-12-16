'use strict';

const data = require('./models').data;
const stateOperationsQueue = require('./models').stateOperationsQueue;
const modelOperationsQueue = require('./models').modelOperationsQueue;
const stateHistory = require('./models').stateHistory;

const operations = require('./operations');

const initAudio = require('./helpers');

// Controller methods

const controller = {
  bindData: function () {
    modelOperationsQueue.splice(0,modelOperationsQueue.length);
    return rivets.bind(
      document.querySelector('#content'),
      { data: data, controller: controller }
    );
  },
  init: function () {
    initAudio();
  },
  syncState: function () {
    const opCount = stateOperationsQueue.length;
    for (const operation of stateOperationsQueue) {
      stateHistory.push(data.state);
      data.state = operation(data.state);
    }
    reflowNotes(data.state.cols);
    console.log("Applied "+opCount+" operations.");
    stateOperationsQueue.splice(0,stateOperationsQueue.length);
    pageParams(data.state);
  },
  popState: function () {
    if (stateHistory.length > 0) {
      data.state = stateHistory.pop();
      console.log(data.state)
      reflowNotes(data.state.cols);
    } else {
      console.log("nothing to undo")
    }
  }
}

window.data = data;
module.exports = controller;
