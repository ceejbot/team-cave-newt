var
  Drone = require('./lib/drone'),
  ardrone = require('ar-drone'),
  events = require('events'),
  util = require('util')
  ;

var drone = new Drone();
drone.selectCamera('front');

var initialHeading;
var bestHeading = 0;
var bestFitness = -1;
function findBestFitness(fitness) {
    if (fitness > bestFitness) {
        bestFitness = fitness;
        bestHeading = drone.heading;
    }

    if (drone.heading == initialHeading) {
      drone.emit('found');
    }
}

drone.on('found', function() {
  drone.removeListener('fitness', findBestFitness);
  drone.client.stop();
  console.log('finished rotation; now seeking', bestFitness, 'at heading', bestHeading);
  drone.turnToHeading(bestHeading);
});

drone.on('heading', function() {
    console.log('we think we have a good heading; moving forward');

    var curFitness = bestFitness;
    drone.on('fitness', function(fitness) {
        if (fitness < curFitness)
            console.log('worry! fitness dropping', fitness);
        curFitness = fitness;
    });

    drone.move(5000, 0.1, function() {
        drone.client.stop();
        console.log('current fitness:', curFitness);
        drone.land(function() {
            process.exit();
        });
    });
});

drone.client.takeoff(function() {
    drone.moveToAltitude(1.5);
    drone.on('altitude', function() {
        initialHeading = drone.heading;
        drone.streamPNGS();
        drone.on('fitness', findBestFitness);
        drone.client.clockwise(0.2);
    });
});
