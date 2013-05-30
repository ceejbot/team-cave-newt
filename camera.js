var drone = require('ar-drone');
var client  = drone.createClient();
var fs = require('fs');
var cv = require('opencv');

client.takeoff();
var pngStream = client.getPngStream();

// front
client.config('video:video_channel', 0);

// bottom
// client.config('video:video_channel', 3);

var counter = 0;
pngStream.on('data', function(data) {
  counter++;

  fs.writeFile('images/image.png', data, function(e) {
    if (e) {
      console.log('alas video fail');
      return;
    }
    cv.readImage('images/image.png', function(err, im) {
      var w = im.width();
      var h = im.height();
      var center = im.get(Math.floor(im.width() / 2), Math.floor(im.height() / 2));
      console.log('w:', w, 'h:', h, 'center:');
    })
  });

  if (counter > 100) {
    client.land(function() {
        process.exit(0);
    });
  }
});


// client.after(5000, function() { this.clockwise(0.5); }).
//   after(2000, function() { this.clockwise(0); }).
//   after(0, function() { this.front(0.1); }).
//   after(2000, function() { this.counterClockwise(0.5); }).
//   after(2000, function() { this.front(0.1); }).
//   after(2000, function() { this.land(); });
