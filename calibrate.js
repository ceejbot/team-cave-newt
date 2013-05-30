//calibrate magnetometer
var drone = require('ar-drone');
var client  = drone.createClient();

try{
	client.takeoff(function() {
		client.calibrate(0);
		client.after(5000, function(){
			client.land(function() {
				client.config('general:navdata_demo', 'FALSE');
				client.on("navdata", function(data) {
					console.dir(data);
					process.exit();
				});
			});
		});
	});
} catch(e) {
	console.log(e);
	client.land();
	process.exit();
}
