const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const util = require ('util');

const store = require('./store');
const index = require('./index');

var app = module.exports = express();

const config = {
  dbAddr: util.format('mongodb://store:%s/notes-data', process.env.MONGO_PORT),
  serverPort: 3000,
};

app.basicAuth('them', process.env.ROOT_PASS);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static('dist'));

app.get('/api', index.getInfo);
app.get('/api/notes', index.getNotes);
app.post('/api/notes', index.processNoteUpdateMessages);
app.post('/api/tags', index.newTags);
app.get('/api/tags', index.getTags);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    res.status(400).json(err);
});

store.connect(config.dbAddr)
  .on('error', console.log)
  .on('disconnected', store.connect)
  .once('open', listen);

function listen () {
  app.listen(config.serverPort, function() {
    console.log('Express server listening on port ' + config.serverPort);
  });
}