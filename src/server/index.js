'use strict';

const path = require('path');
const mongoose = require('mongoose');

const Tag = mongoose.model('Tag');
const Note = mongoose.model('Note');

function getInfo (req, res) {
  res.status(200).json({ ApiVersion: 1.0 });
}

function getNotes (req, res) {
  Note.find({}, function (err, notes) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(notes);
    }
  });
}

function newNotes (req, res) {
  console.log("new notes")
  Note.find({}).remove(function () {
    var notes = req.body.length;
    if (notes == 0) {
      res.status(200).json({});
      return;
    }
    console.log(req.body)
    req.body.forEach(function (newNoteData) {
      console.log("processing note "+newNoteData.title)
      const newNote = new Note({ title: newNoteData.title, text: newNoteData.text });
      var tags = newNoteData.tags.length;
      if (tags == 0) {
        newNote.save(function (err, product, count) {
          if (--notes == 0) {
            if (err) {
              res.status(500).json(err);
            } else {
              res.status(200).json(product);
            }
          }
        });
      } else {
        for (var tagId of newNoteData.tags) {
          Tag.findById(tagId, function (err, tag) {
            newNote.tags.push(tag);
            if (--tags == 0) {
              newNote.save(function (err, product, count) {
                if (--notes == 0) {
                  if (err) {
                    res.status(500).json(err);
                  } else {
                    res.status(200).json(product);
                  }
                }
              });
            }
          })
        }
      }
    });
  });
}

function getTags (req, res) {
  Tag.find({}, function (err, tags) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(tags);
    }
  });
}

function newTags (req, res) {
  console.log("new tags")
  var tags = req.body.length;
  req.body.forEach(function (newTagData) {
    console.log("processing tag "+newTagData.title)
    const newTag = new Tag(newTagData);
    newTag.save(function (err, product, count) {
      tags--;
      if (tags == 0) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(product);
        }
      }
    });
  });
}

module.exports = {
  getInfo,
  newNotes,
  getNotes,
  newTags,
  getTags,
};