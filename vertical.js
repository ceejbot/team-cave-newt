var
  _ = require('lodash'),
  drone = require('ar-drone')
  ;

var client  = drone.createClient();
var goalAlt;

client.on('navdata', function(navdata)
{
	var currAlt = navdata.demo.altitudeMeters;
	console.log('current altitude:', currAlt);
	var diff = (goalAlt - currAlt);

	if (diff < 0.025)
	{
    console.log('goal altitude reached');
    client.up(0);
    client.down(0);
	}
  else if (diff > 0)
  {
    client.up(0.1);
  }
  else
    client.down(0.1);
});

function verticalMoveTo(desired)
{
	goalAlt = desired;
}

client.takeoff(function() {
  //  after(2000, function() { this.counterClockwise(0.5); }).
    client.after(1000, function() { verticalMoveTo(2.0); }).
    after(4000, function() { verticalMoveTo(2.5); }).
    after(4000, function() { verticalMoveTo(0.5); }).
    after(2000, function() { this.land(functio() {
      process.exit(0);
    }); });
});

