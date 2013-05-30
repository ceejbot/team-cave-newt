var
  _       = require('lodash'),
  cv      = require('opencv'),
  ardrone = require('ar-drone'),
  events  = require('events'),
  fs      = require('fs'),
  util    = require('util')
  ;

var pixels = require('../pixels.js')({ size: { width: 50, height: 50 } });
var classifier = require('../classifier.js')({ debug: false});


function Drone()
{
  events.EventEmitter.call(this);
  this.client = ardrone.createClient();
  this.goalAltitude = undefined;

  this.client.on('navdata', this.handleNav.bind(this));

}
util.inherits(Drone, events.EventEmitter);

Drone.prototype.selectCamera = function(position)
{
  if (position === 'bottom')
    this.client.config('video:video_channel', 3);
  else
    this.client.config('video:video_channel', 0);

  console.log('camera', position, 'selected');
};

Drone.prototype.takeoff = function(cb)
{
  var self = this;

  self.client.takeoff(function() {
    self.client.after(500, cb);
  });
};

Drone.prototype.move = function(time, speed, cb)
{
  var self = this;

  var backward = false;
  if (speed < 0) {
    backward = true;
    speed = -speed;
  }
  if (backward) {
    self.client.back(speed);
  } else {
    self.client.front(speed);
  }

  self.client.after(time, cb);
};

Drone.prototype.handleNav = function(navdata)
{
  if (_.isUndefined(this.goalAltitude))
    return;

    var currAlt = navdata.demo.altitudeMeters;
    var diff = (this.goalAltitude - currAlt);

    if (diff < 0.025)
    {
      console.log('goal altitude reached');
      this.client.up(0);
      this.client.down(0);
      this.goalAltitude = undefined;
      this.emit('altitude');
    }
    else if (diff > 0)
      this.client.up(0.1);
    else
      this.client.down(0.1);
};

Drone.prototype.moveToAltitude = function(height)
{
  this.goalAltitude = height;
};


Drone.prototype.streamPNGS = function()
{
  var self = this;
  this.pngStream = this.client.getPngStream();
  var s = new cv.ImageStream()

  s.on('data', function(matrix) {
      pixels.handle(matrix, function(err) {
        if (err)
          return;
        var result = classifier.classify(pixels);
      });
  });

  this.client.getPngStream().pipe(s);
};

Drone.prototype.grabPNGs = function(desired)
{
  var self = this;
  desired = desired || 50;
  this.pngStream = this.client.getPngStream();

  var counter = 0;
  console.log('requesting ' + desired + ' pngs');

  var handlePNG = function handlePNG(data)
  {
    var imgfile = 'images/image' + counter + '.png';

    fs.writeFile(imgfile, data, function(e) {
      if (e) {
        console.log('alas video fail');
        return;
      }
      cv.readImage('images/image.png', function(err, im) {
        var w = im.width();
        var h = im.height();
        var center = im.get(Math.floor(im.width() / 2), Math.floor(im.height() / 2));
        console.log('w:', w, 'h:', h, 'center:', center);
      });
    });

    if (++counter > desired)
      stopGrabbing();
  };

  function stopGrabbing()
  {
    console.log('stopping png grabs');
    self.pngStream.removeListener('data', handlePNG);
    drone.emit('pngs');
  }

  this.pngStream.on('data', handlePNG);
};

module.exports = Drone;
