var
  Drone = require('./lib/drone'),
  ardrone = require('ar-drone'),
  events = require('events'),
  util = require('util')
  ;

var drone = new Drone();
drone.selectCamera('front');


var bestFitness = -1;
function findBestFitness(fitness) {
	bestFitness = Math.max(fitness, bestFitness);
}

function seekFitness(fitness) {
	if (fitness == bestFitness) {
		drone.client.clockwise(0);
		drone.emit('headingGood');
	}
}


drone.on('headingGood', function() {
	console.log('we think we have a good heading; moving forward');
});


drone.on('altitude', function() {
  drone.streamPNGS();

  // 360 noting orientations
  // through one orbit
  // note best & worst & heading at both

  // repeat a rotation; at best, move forward.
  drone.on('fitness', findBestFitness);

  drone.client.clockwise(0.2);

  drone.client.after(10000, function() {
	drone.removeListener('fitness', findBestFitness);
	drone.client.stop();
	console.log('finished rotation; now seeking', bestFitness);
	drone.on('fitness', seekFitness);
	drone.client.clockwise(0.2);
  });
});

drone.client.takeoff(function() {
  drone.moveToAltitude(1.5);
});


