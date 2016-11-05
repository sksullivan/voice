'use strict';


module.exports = {
  connect,
};

const mongoose = require('mongoose');


/* Returns a Mongoose connection */
function connect (dbAddr) {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(dbAddr, options).connection;
}