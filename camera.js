var
  Drone = require('./lib/drone'),
  ardrone = require('ar-drone'),
  events = require('events'),
  util = require('util')
  ;

var drone = new Drone();
drone.selectCamera('bottom');

drone.on('pngs', function() {
  drone.client.land(function() {
    process.exit(0);
  });
});

drone.on('altitude', function() {

  // drone.streamPNGS();
  drone.grabPNGs(50);

  drone.move(5000, 0.05, function() {
    drone.move(2500, -0.1, function() {
      drone.client.stop();
    });
  });
});

drone.client.takeoff(function() {
  drone.moveToAltitude(2.0);
});



