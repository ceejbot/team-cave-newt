var drone = require('ar-drone');
var client  = drone.createClient();

client.takeoff();
client.after(5000, function() { this.clockwise(0.5); }).
  after(2000, function() { this.clockwise(0); }).
  after(0, function() { this.front(0.1); }).
  after(2000, function() { this.counterClockwise(0.5); }).
  after(2000, function() { this.front(0.1); }).
  after(2000, function() { this.land(); });
