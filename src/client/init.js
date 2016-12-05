'use strict';

// Application Initialization

// Styles
require('./styles/stylesheet.scss');

// Other js
const controller = require('./js/controller');
const pageParams = require('./js/helpers').pageParams;
const data = require('./js/models').data;

controller.loadNotes();

data.state.cols = pageParams()['cols'] || 1;

const handleKeys = function (e) {
  if (e.altKey) {
    if (e.keyCode == 78) { // N
      controller.newNote();
      e.preventDefault();
    }
    if (e.keyCode == 83) { // S
      $('#search').focus();
      $('html, body').animate({
        scrollTop: 0
      }, 2000);
      e.preventDefault();
    }
    if (e.keyCode == 67) { // C
      controller.clearAll();
      e.preventDefault();
    }
  }
  console.log(e.keyCode);
};

window.onkeydown = handleKeys;

window.testUndo = function () {
  controller.popState();
}
