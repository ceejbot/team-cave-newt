var pixels = require('./pixels.js')();
var classifier = require('./classifier.js')();
pixels.read('images/image.png', function (err) {
  if (err) {
    console.log('could not read png');
    process.exit(1);
  }
  var result = classifier.classify(pixels);
  console.log(result);
});



