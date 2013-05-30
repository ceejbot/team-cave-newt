//hop.js

var Drone = require('./lib/drone');

var gamma = 0.8;
var time = 1000;

function land_exit() {
	drone.client.land(function() {
		process.exit();
	});
}

var drone = new Drone();
drone.takeoff(function() {
	drone.move(1000, 0.1, function() {
		drone.move(1000, -0.1, function() {
			land_exit();
		});
	});
});
