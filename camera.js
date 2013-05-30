var
  Drone = require('./lib/drone'),
  ardrone = require('ar-drone'),
  events = require('events'),
  util = require('util')
  ;

var drone = new Drone();
drone.selectCamera('front');

drone.on('done', function() {
  drone.client.front(0);
  drone.client.land(function() {
    process.exit(0);
  });
});

drone.client.takeoff(function() {
    drone.grabPNGs(50);
    drone.client.front(0.05);
    drone.client.after(5000, function() {
        drone.client.front(0);
        drone.client.stop();
    });
});



