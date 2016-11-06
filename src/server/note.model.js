const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TagSchema = mongoose.model('Tag').schema;

const NoteSchema = new Schema({
  title: { type: String, default: '', required: true },
  text: { type: String, default: '', required: true },
  dateCreated: { type: Date, default: Date.now, required: true },
  dateEdited: { type: Date, default: Date.now, required: false },
  tags: [TagSchema]
});

mongoose.model('Note', NoteSchema);