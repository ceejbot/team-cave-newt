// Usage:
// var pixels = require('./pixels.js')('path-to-file.png');
// console.log(pixels.width + ',' + pixels.height);
// console.log(pixels.get(x, y)) <-- returns r, g, b triplet 0-255 values

var fs = require('fs');
var cv = require('opencv');

module.exports = function(options) {
  return new Pixels(options);
};

function Pixels(options) {
  if (!options) {
    options = {};
  }
  var self = this;

  self.get = function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    var w = self.width;
    var row = self.rows[y];
    var offset = x * 3;
    return [ row[x * 3 + 2], row[x * 3 + 1], row[x * 3] ];
  };

  self.handle = function(im, callback) {
    // This is a distortion but it's not important
    if (options.size) {
      im.resize(options.size.width, options.size.height);
    }
    self.width = im.width();
    self.height = im.height();
    self.rows = [];
    var i;
    for (i = 0; (i < self.height); i++) {
      self.rows[i] = im.pixelRow(i);
    }
    return callback(null);
  };

  self.read = function(png, callback) {
    cv.readImage(png, function(err, im) {
      if (err) {
        return callback(err);
      }
      self.handle(im, callback);
    });
  };
}
