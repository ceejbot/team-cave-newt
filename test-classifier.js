var pixels = require('./pixels.js')();
var classifier = require('./classifier.js')();
var argv = require('optimist').argv;

var path = argv._[0] ? argv._[0] : 'images/image.png';
console.log('analyzing ' + path);
pixels.read(path, function (err) {
  if (err) {
    console.log('could not read ' + path);
    process.exit(1);
  }
  var result = classifier.classify(pixels);
  console.log(result);
});



