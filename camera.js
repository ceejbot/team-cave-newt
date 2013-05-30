var
  Drone = require('./lib/drone'),
  ardrone = require('ar-drone'),
  events = require('events'),
  util = require('util')
  ;

var drone = new Drone();
drone.selectCamera('front');

drone.on('pngs', function() {
  drone.client.land(function() {
    process.exit(0);
  });
});

drone.on('altitude', function() {
  drone.grabPNGs(50);
  drone.client.front(0.05);
  drone.client.after(10000, function() {
      drone.client.stop();
      drone.client.back(0.1);
      drone.client.after(5000, function() {
        drone.client.land();
      });
  });
});

drone.client.takeoff(function() {
  drone.moveToAltitude(2.0);
});



