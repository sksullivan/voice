const data = {
  title: 'Welcome to the notebook',
  layoutClass: "col-md-4",
  notes: []
};

var operations = [];

rivets.binders.addclass = function(el, value) {
  if(el.addedClass) {
    $(el).removeClass(el.addedClass)
    delete el.addedClass
  }

  if(value) {
    $(el).addClass(value)
    el.addedClass = value
  }
}

function bindData () {
  operations = [];
  return rivets.bind(
    document.querySelector('#content'),
    { data: data, controller: controller }
  );
}

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
  }
}

controller.loadNotes();