'use strict';

const deepToString = require('./helpers').deepToString;

// Custom Rivets Items

rivets.binders['add-class'] = function (el, value) {
  if (el.addedClass) {
    $(el).removeClass(el.addedClass);
    delete el.addedClass;
  }
  if (value) {
    $(el).addClass(value);
    el.addedClass = value;
  }
}

rivets.binders['on-enter'] = {
  bind: function (el) {
    var rivetsView = this, $el = $(el);
    $el.on('keyup', function(event) {
      console.log("what");
      if (event.keyCode == 13) {
        $el.blur();
        console.log("trace")
        rivetsView.observer.value()(event,rivetsView.observer.obj);
      }
    });
  },
  unbind: function (el) {
    $(el).off('keyup');
  },
  function: true
};

rivets.formatters.filterByFilterItems = function (items, textFilters, search) {
  const filters = textFilters.slice();
  filters.push(search);
  return items.filter(function (item) {
    const itemText = deepToString(item).toLowerCase();
    return filters.map(function (filter) {
      return itemText.indexOf(filter.toLowerCase()) != -1;
    }).reduce(function (prev, curr) {
      return prev && curr;
    },true);
  });
};
