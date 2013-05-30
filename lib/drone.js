var
  cv = require('opencv'),
  ardrone = require('ar-drone'),
  events = require('events'),
  fs = require('fs'),
  util = require('util')
  ;

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

Drone.prototype.handleNav = function(navdata)
{
  // console.log(navdata);
};

Drone.prototype.moveToVertical = function(height)
{
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
    self.pngStream.removeListener(handlePNG);
    drone.emit('done');
  }

  this.pngStream.on('data', handlePNG);
};

module.exports = Drone;
