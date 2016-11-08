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

function processNoteUpdateMessages (req, res) {
  var messages = req.body.length;
  if (messages == 0) {
    res.status(200).json({});
    return;
  }
  console.log(req.body)
  req.body.forEach(function (message) {
    console.log("processing messages!!!!!");

    // Case new note
    if (message.type == "add") {
      const newNote = new Note({ title: message.note.title, text: message.note.text, dateCreated: Date.now(), dateEdited: Date.now() });
      var tags = message.note.tags.length;
      if (tags == 0) {
        newNote.save(function (err, product, count) {
          if (--messages == 0) {
            if (err) {
              res.status(500).json(err);
            } else {
              getNotes(req,res);
            }
          }
        });
      } else {
        for (var tagId of message.note.tags) {
          Tag.findById(tagId, function (err, tag) {
            newNote.tags.push(tag);
            if (--tags == 0) {
              newNote.save(function (err, product, count) {
                if (--messages == 0) {
                  if (err) {
                    res.status(500).json(err);
                  } else {
                    getNotes(req,res);
                  }
                }
              });
            }
          });
        }
      }

    // Case delete note
    } else if (message.type == "delete") {
      Note.findById(message.note._id).remove(function (err) {
        if (--messages == 0) {
          if (err) {
            res.status(500).json(err);
          } else {
            getNotes(req,res);
          }
        }
      });

    // Case other
    } else {
      message.note.dateEdited = Date.now()
      Note.findByIdAndUpdate(message.note._id, message.note, {upsert:true}, function(err) {
        console.log(err)
        if (--messages == 0) {
          if (err) {
            res.status(500).json(err);
          } else {
            getNotes(req,res);
          }
        }
      });
    }
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
  processNoteUpdateMessages,
  getNotes,
  newTags,
  getTags,
};