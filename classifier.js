module.exports = function(options) {
  return new Classifier(options);
};

function Classifier(options) {
  if (!options) {
    options = {};
  }
  var self = this;
  // Returns an object with the following boolean properties:
  // box: the black box is in the image
  // runway: the runway is in the image
  // strip: the strip is in the image
  self.classify = function(pixels) {
    var x, y;
    var result = {};
    var maxes = [ 0, 0, 0 ];
    var map = [];
    for (y = 0; (y < pixels.height); y++) {
      map[y] = [];
      for (x = 0; (x < pixels.width); x++) {
        var rgb = pixels.get(x, y);
        var i;
        for (i = 0; (i < 3); i++) {
          if (rgb[i] > maxes[i]) {
            maxes[i] = rgb[i];
          }
        }
        var type = 'n';
        if (self.isBlack(rgb)) {
          result.box = true;
          type = 'B';
        } else if (self.isOrange(rgb)) {
          result.strip = true;
          type = 'S';
        } else if (self.isWhite(rgb)) {
          result.runway = true;
          type = 'r';
        }
        map[y].push(type);
      }
    }
    if (options.debug) {
      console.log('BEFORE PRUNING');
      self.showMap(map);
    }

    self.pruneMap(map);
    if (options.debug) {
      console.log('AFTER PRUNING');
      self.showMap(map);
    }

    result.map = map;
    // console.log('maxes:');
    // console.log(maxes);
    return result;
  };
  self.isBlack = function(rgb) {
    return ((rgb[0] < 128) && (rgb[1] < 128) && (rgb[2] < 128));
  };
  self.isWhite = function(rgb) {
    return (rgb[0] + rgb[1] + rgb[2] > 576);
  };
  self.isOrange = function(rgb) {
    return (rgb[0] > 220) && (rgb[2] < 192);
  };
  self.pruneMap = function(map) {
    var x, y;
    var height = map.length;
    var width = map[0].length;
    for (y = 0; (y < height); y++) {
      for (x = 0; (x < width); x++) {
        if (map[y][x] === 'B') {
          // If we're not within 2 pixels of the stripe, we're
          // probably a table or a chunk of carpet or something.
          // If we rely only on the runway we tend to find the
          // edges of the tables too
          var nx, ny;
          var found = false;
          for (ny = y - 2; (ny <= (y + 2)); ny++) {
            if (found) {
              break;
            }
            for (nx = x - 2; (nx <= (x + 2)); nx++) {
              if ((nx < 0) || (nx >= width) || (ny < 0) || (ny >= height)) {
                continue;
              }
              if (map[ny][nx] === 'S') {
                found = true;
                break;
              }
            }
          }
          if (!found) {
            // Reclassify as boring
            map[y][x] = 'n';
          }
        }
      }
    }
  };
  self.showMap = function(map) {
    var x, y;
    for (y = 0; (y < map.length); y++) {
      var s = '';
      for (x = 0; (x < map[y].length); x++) {
        s += map[y][x];
      }
      console.log(s);
    }
  };
}
