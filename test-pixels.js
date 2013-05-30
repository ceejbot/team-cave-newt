var drone = require('ar-drone');
var client  = drone.createClient();
var fs = require('fs');
var cv = require('opencv');

var pixels = require('./lib/pixels.js')({ size: { width: 100, height: 100 }});
pixels.read('images/image.png', function (err) {
  if (err) {
    console.log('read failed');
    process.exit(1);
  }
  console.log(pixels.width + 'x' + pixels.height);
  console.log('center pixel R, G, B:');
  console.log(pixels.get(pixels.width / 2, pixels.height / 2));
  process.exit(0);
});


