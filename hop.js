//hop.js
var gamma = 0.8;
var time = 1000;

var drone = require('ar-drone');
var client  = drone.createClient();
function takeoff_settle(cb) {
	client.takeoff(function() {
		client.after(500, cb);
	});
}

function move(distance, speed, cb) {
	var backward = false;
	if (distance < 0) {
		backward = true;
		distance = -distance;
	}
	if (backward) {
		client.back(speed);
	} else {
		client.front(speed);
	}
	client.after(distance, cb);
}

function land_exit() {
	client.land(function() {
		process.exit();
	})
}

takeoff_settle(function() {
	move(1000, 0.1, function() {
		move(-1000, 0.1, function() {
			land_exit();
		});
	});
});
