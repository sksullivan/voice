// Application State

const data = {
  title: 'Welcome to the notebook',
  layoutClass: "col-md-4",
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
      }
    });
    operations = [];
  },
  deleteNote: function (e, model) {
    operations.push({ type: "delete", note: data.notes[model.index] });
    controller.syncNotes();
  },
  newNote: function (e, model) {
    const newNote = {
      title: "New note",
      text: "Write some nice stuff here!",
      tags: []
    };
    operations.push({ type: "add", note: newNote });
    controller.syncNotes();
  },
  viewGrid: function (e, model) {
    data.layoutClass = "col-md-4";
  },
  viewList: function (e, model) {
    data.layoutClass = "col-md-12";
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
  },
  applyTextFilterFromSearch: function (e, model) {
    if (data.search != "") {
      data.filters.push(data.search);
      controller.clearSearch();
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
    // data.filters.splice(0,data.filters.length);
  }
}


// Helper Functions

function deepToString(item) {
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


// Application Initialization

controller.loadNotes();