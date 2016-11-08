const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TagSchema = mongoose.model('Tag').schema;

const NoteSchema = new Schema({
  title: { type: String, default: '', required: false },
  text: { type: String, default: '', required: false },
  dateCreated: { type: Date, required: true },
  dateEdited: { type: Date, required: false },
  tags: [TagSchema]
});

mongoose.model('Note', NoteSchema);