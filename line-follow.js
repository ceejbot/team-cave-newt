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
}

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
    console.log('moving to altitude');
    drone.moveToAltitude(1.5);
    drone.on('altitude', function() {
      console.log('streaming PNGs');
      drone.streamPNGS();
      seek();
    });
    function seek() {
      console.log('seeking best heading');
      // Start turning; after 5 seconds, move
      initialHeading = drone.heading;
      drone.on('fitness', findBestFitness);
      drone.client.clockwise(0.2);
      setTimeout(function() {
        revisit();
      }, 5000);
    }
    function revisit() {
      console.log('revisiting to best heading');
      drone.removeListener('fitness', findBestFitness);
      drone.client.stop();
      console.log('finished rotation; now seeking', bestFitness, 'at heading', bestHeading);
      drone.on('heading', stopTurning);
      drone.turnToHeading(bestHeading);
    }
    function stopTurning() {
      console.log('waiting to settle after turn');
      setTimeout(move, 500);
    }
    function move() {
      console.log('moving forward');
      drone.move(1000, 0.2, stopMoving);
    }
    function stopMoving() {
      console.log('waiting 0.5 seconds then seeking again');
      setTimeout(seek, 500);
    }
});
