const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  title: { type: String, default: '' },
});

mongoose.model('Tag', TagSchema);