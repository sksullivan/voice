// Application State

const data = {
  title: 'Welcome to the notebook',
  cols: pageParams()['cols'],
  filters: [],
  search: "",
  notes: []
};

var operations = [];


// Custom Rivets Items

rivets.binders["add-class"] = function(el, value) {
  if (el.addedClass) {
    $(el).removeClass(el.addedClass)
    delete el.addedClass
  }
  if (value) {
    $(el).addClass(value)
    el.addedClass = value
  }
}

rivets.binders['on-enter'] = {
  bind: function (el) {
    var rivetsView = this, $el = $(el);
    $el.on('keyup', function(event) {
      if(event.keyCode === 13) {
        $el.blur();
        rivetsView.observer.value()(event,{ text: $el.val() });
      }
    });
  },
  unbind: function (el) {
    $(el).off('keyup');
  },
  function: true
};

rivets.formatters.filterByFilterItems = function(items, textFilters, search) {
  const filters = textFilters.slice();
  filters.push(search);
  reflowNotes();
  return items.filter(function (item) {
    const itemText = deepToString(item).toLowerCase();
    return filters.map(function (filter) {
      return itemText.indexOf(filter.toLowerCase()) != -1;
    }).reduce(function (prev, curr) {
      return prev && curr;
    },true);
  });
};


// Rivets Operations

function bindData () {
  console.log(pageParams()['layoutClass']);
  operations = [];
  return rivets.bind(
    document.querySelector('#content'),
    { data: data, controller: controller }
  );
}


// Controller methods

const controller = {
  loadNotes: function () {
    $.get("/api/notes",function (newData) {
      console.log(newData);
      data.notes = newData;
      bindData();
      reflowNotes();
    });
  },
  syncNotes: function () {
    $.ajax({
      url: "/api/notes",
      type: "POST",
      data: JSON.stringify(operations),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (newData, err) {
        data.notes = newData;
        reflowNotes();
      }
    });
    operations = [];
  },
  deleteNote: function (e, model) {
    operations.push({ type: "delete", note: data.notes[model.index] });
    controller.syncNotes();
  },
  newNote: function (e, model) {
    console.log("new note");
    const newNote = {
      title: "New note",
      text: "Write some nice stuff here!",
      tags: []
    };
    operations.push({ type: "add", note: newNote });
    controller.syncNotes();
  },
  viewGrid: function (e, model) {
    data.cols = 5;
    pageParams({"cols":data.cols});
    reflowNotes();
  },
  viewBook: function (e, model) {
    data.cols = 2;
    pageParams({"cols":data.cols});
    reflowNotes();
  },
  viewList: function (e, model) {
    data.cols = 1;
    pageParams({"cols":data.cols});
    reflowNotes();
  },
  updateNoteData: function (e, model) {
    if (e.target.tagName == "INPUT") {
      data.notes[model.index].title = e.target.value;
    } else {
      data.notes[model.index].text = e.target.innerText;
    }
    operations.push({ type: "update", note: data.notes[model.index] });
    controller.syncNotes();
  },
  applyTextFilterFromTag: function (e, model) {
    data.filters.push(data.notes[model["%note%"]].tags[model["%tag%"]].title);
    reflowNotes();
  },
  applyTextFilterFromSearch: function (e, model) {
    if (data.search != "") {
      data.filters.push(data.search);
      controller.clearSearch();
      reflowNotes();
    }
  },
  deleteFilter: function (e, model) {
    data.filters.splice(model.index,1);
  },
  clearSearch: function (e, model) {
    $('#search').val("");
    data.search = "";
  },
  clearAll: function () {
    $('#search').val("");
    data.search = "";
    data.filters = [];
  }
}


// Helper Functions

function deepToString (item) {
  return Object.keys(item).map(function (key) {
    const value = item[key];
    if (typeof value == "string") {
      return value;
    } else if (typeof value == "object") {
      return deepToString(value);
    } else {
      return "";
    }
  }).reduce(function (curr,next) {
    if (curr == "" || next == "") {
      return curr + next;
    } else {
      return curr + " " + next;
    }
  },"");
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

function reflowNotes () {
  $('.grid').masonry('reloadItems');
  $('.note').css('width',($(window).width() - 70) / data.cols - 20);
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: ($(window).width() - 70) / data.cols
  });
}


// Application Initialization

controller.loadNotes();