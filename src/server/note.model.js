const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TagSchema = mongoose.model('Tag').schema;

const NoteSchema = new Schema({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
  tags: [TagSchema]
});

mongoose.model('Note', NoteSchema);