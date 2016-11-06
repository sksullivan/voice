const data = {
  title: 'Welcome to the notebook',
  notes: []
};

var operations = [];

function bindData () {
  operations = [];
  return rivets.bind(
    document.querySelector('#content'),
    { data: data, controller: controller }
  );
}

function reflowNotes () {
  
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
    const newNote = {
      title: "New note",
      text: "Write some nice stuff here!",
      tags: []
    };
    operations.push({ type: "add", note: newNote });
    controller.syncNotes();
  },
  updateNote: function (e, model) {
    operations.push({ type: "update", note: data.notes[model.index] });
    controller.syncNotes();
  }
}

controller.loadNotes();