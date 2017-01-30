'use strict';

const path = require('path');
const fs = require('fs');



function getInfo (req, res) {
  res.status(200).json({ ApiVersion: 1.0 });
}

function receiveAudio (req, res) {
	console.log(req.body)
  // fs.writeFileSync("./test.wav", new Buffer(req.body.data, 'base64'), '') 
}

module.exports = {
  getInfo,
  receiveAudio
};