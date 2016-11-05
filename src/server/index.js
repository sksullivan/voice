'use strict';

const path = require('path');

function getInfo (req, res) {
  res.status(200).json({ ApiVersion: 1.0 });
}

module.exports = {
  getInfo,
};