module.exports = function() {
  return new Classifier();
};

function Classifier() {
  var self = this;
  // Returns an object with the following boolean properties:
  // box: the black box is in the image
  // runway: the runway is in the image
  // strip: the strip is in the image
  self.classify = function(pixels) {
    var x, y;
    var result = {};
    var maxes = [ 0, 0, 0 ];
    for (y = 0; (y < pixels.height); y++) {
      for (x = 0; (x < pixels.width); x++) {
        var rgb = pixels.get(x, y);
        var i;
        for (i = 0; (i < 3); i++) {
          if (rgb[i] > maxes[i]) {
            maxes[i] = rgb[i];
          }
        }
        if (self.isBlack(rgb)) {
          result.box = true;
        }
        if (self.isOrange(rgb)) {
          result.strip = true;
        }
        if (self.isWhite(rgb)) {
          result.runway = true;
        }
      }
    }
    console.log('maxes:');
    console.log(maxes);
    return result;
  };
  self.isBlack = function(rgb) {
    return (rgb[0] + rgb[1] + rgb[2] < 64);
  };
  self.isWhite = function(rgb) {
    return (rgb[0] + rgb[1] + rgb[2] > 576);
  };
  self.isOrange = function(rgb) {
    return (rgb[0] > 220) && (rgb[2] < 192);
  };
}
