var pixels = require('./pixels.js')({ size: { width: 50, height: 50 } });
var classifier = require('./classifier.js')({ debug: true});
var argv = require('optimist').argv;

var path = argv._[0] ? argv._[0] : 'images/image.png';
console.log('analyzing ' + path);
pixels.read(path, function (err) {
  if (err) {
    console.log('could not read ' + path);
    process.exit(1);
  }
  var result = classifier.fitness(pixels);
  console.log('fitness: ' + result);
});



