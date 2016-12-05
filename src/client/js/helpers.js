'use strict';

// Helper Functions

function deepToString (item) {
  return Object.keys(item).map(function (key) {
    const value = item[key];
    if (typeof value == 'string') {
      return value;
    } else if (typeof value == 'object') {
      return deepToString(value);
    } else {
      return '';
    }
  }).reduce(function (curr,next) {
    if (curr == '' || next == '') {
      return curr + next;
    } else {
      return curr + ' ' + next;
    }
  },'');
}

function pageParams (data) {
  if (data) {
    const query = Object.keys(data)
      .map(function (key) {
        return key + '=' + data[key];
      }).join('&');
    const newUrl = window.location.origin + window.location.pathname + '?' + query;
    window.history.pushState({ url: newUrl }, 'lol', newUrl);
    return;
  }
  if (window.location.href.indexOf('?') != -1) {
    return window.location.href
      .split('?')[1]
      .split('&')
      .map(function (pair) {
        return pair.split('=');
      }).reduce(function (prev, curr) {
        prev[curr[0]] = curr[1];
        return prev;
      },{});
  } else {
    return {};
  }
}

function reflowNotes (cols) {
  setTimeout(function () {
    $('.grid').masonry('reloadItems');
    $('.note').css('width',($(window).width() - 70) / cols - 20);
    $('.grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: ($(window).width() - 70) / cols
    });
  },0);
}

module.exports = {
  pageParams,
  reflowNotes,
  deepToString,
}
