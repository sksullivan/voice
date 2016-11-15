const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: { type: String, required: false },
});

mongoose.model('Tag', TagSchema);