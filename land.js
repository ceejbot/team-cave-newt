//land.js
var drone = require('ar-drone');
var client  = drone.createClient();

client.land(function() {
	process.exit();
});
