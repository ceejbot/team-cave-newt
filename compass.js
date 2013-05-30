// drone compass
var Drone = require('./lib/drone');

function land_exit() {
	drone.client.land(function() {
		process.exit();
	});
}

var drone = new Drone();
drone.client.config('general:navdata_demo', 'FALSE');
var x = 0;
drone.client.on("navdata", function(data) {
	console.log("z="+data.demo.rotation.clockwise);
});
