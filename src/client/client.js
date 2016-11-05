const data = {
  title: 'Welcome to the notebook',
  notes: [
    {
      title: "Heres a test note",
      text: "Here's the text. Notice that it's a bit longer than the title.",
      tags: ["581e5fac647b8a001f0019db"]
    }
  ]
};

var oldNotes = [];

const controller = {
  loadNotes: function () {
    $.get("/api/notes",function (newData) {
      data.notes = newData;
      oldNotes = newData;
      rivets.bind(
        document.querySelector('#content'),
        { data: data, controller: controller }
      );
    });
  },
  syncNotes: function () {
    const newNotes = data.notes;
    // const newNotes = data.notes.filter(function (note) { return oldNotes.indexOf(note) == -1 })
    console.log(newNotes.length)
    console.log(newNotes)
    $.ajax({
      url: "/api/notes",
      type: "POST",
      data: JSON.stringify(newNotes),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function (data) {
        console.log(data);
      }
    });
  },
  deleteNote: function (e, model) {
    data.notes.splice(model.index,1)
  },
  newNote: function (e, model) {
    data.notes.push({
      title: "New note",
      text: "Write some nice stuff here!",
      tags: []
    })
  }
}

controller.loadNotes();