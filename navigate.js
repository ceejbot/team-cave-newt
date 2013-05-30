//hop.js

var Drone = require('./lib/drone');

function land_exit() {
	drone.client.land(function() {
		process.exit();
	});
}

var drone = new Drone();
drone.takeoff(function() {
	drone.client.clockwise(0.5);
	drone.client.config('general:navdata_demo', 'FALSE');
	var x = 0;
	drone.client.on("navdata", function(data) {
		console.log("z="+data.demo.rotation.clockwise);
		if (x++ > 100) {
			drone.client.left(0);
			land_exit();
		}
	})
});
