//hop.js

var Drone = require('./lib/drone');

function land_exit() {
	drone.client.land(function() {
		process.exit();
	});
}

var drone = new Drone();
drone.takeoff(function() {
	drone.goalAltitude=1.5;
	drone.on("altitude", function() {
		drone.goalHeading = 90;
		drone.on("heading", function() {
			drone.goalHeading = 0;
			drone.on("heading", function() {
				land_exit();
			})
		})
	});
});
