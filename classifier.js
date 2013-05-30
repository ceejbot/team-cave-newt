// Set options.debug = true for lots of debug output including
// lovely classifier maps on the console

module.exports = function(options) {
  return new Classifier(options);
};

function Classifier(options) {
  if (!options) {
    options = {};
  }
  var self = this;

  // Returns a number indicating the suitability of the
  // image as a landing site, more or less. It is actually
  // the number of pixels of the black target box found after
  // scaling the image to 50x50 and classifying each pixel
  // by various heuristics to rule out false positives.

  self.fitness = function(pixels) {
    var x, y;
    var info = {};
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
          info.box = true;
          type = 'B';
        } else if (self.isOrange(rgb)) {
          info.strip = true;
          type = 'S';
        } else if (self.isWhite(rgb)) {
          info.runway = true;
          type = 'r';
        }
        map[y].push(type);
      }
    }
    if (options.debug) {
      console.log('BEFORE PRUNING');
      self.showMap(map);
    }

    info.maxes = maxes;

    self.pruneMap(map);
    if (options.debug) {
      console.log('AFTER PRUNING');
      self.showMap(map);
    }

    if (options.debug) {
      console.log(info);
    }

    return self.measureFitness(map);
    // console.log('maxes:');
    // console.log(maxes);
  };
  self.isBlack = function(rgb) {
    // Black isn't all that black
    return ((rgb[0] < 160) && (rgb[1] < 160) && (rgb[2] < 160));
  };
  self.isWhite = function(rgb) {
    return (rgb[0] + rgb[1] + rgb[2] > 576);
  };
  self.isOrange = function(rgb) {
    return (rgb[0] - rgb[1] > 32) && (rgb[0] - rgb[2] > 32);
  };
  self.pruneMap = function(map) {
    var x, y;
    var height = map.length;
    var width = map[0].length;

    var nx, ny;
    var stripey;

    // Isolated stripe pixels are not important
    for (y = 0; (y < height); y++) {
      for (x = 0; (x < width); x++) {
        if (map[y][x] === 'S') {
          stripey = 0;
          // If we're not within 3 pixels of 2 more stripe pixels,
          // we're probably somebody's shirt.
          for (ny = y - 3; (ny <= (y + 3)); ny++) {
            for (nx = x - 3; (nx <= (x + 3)); nx++) {
              if ((nx < 0) || (nx >= width) || (ny < 0) || (ny >= height)) {
                continue;
              }
              if (map[ny][nx] === 'S') {
                stripey++;
                break;
              }
            }
          }
          // An isolated pixel of stripe is not enough!
          if (stripey < 2) {
            // Reclassify as boring
            map[y][x] = 'n';
          }
        }
      }
    }

    for (y = 0; (y < height); y++) {
      for (x = 0; (x < width); x++) {
        if (map[y][x] === 'B') {
          // If we're not within 3 pixels of the stripe, we're
          // probably a table or a chunk of carpet or something.
          // If we rely on the runway we tend to find the
          // edges of the tables too. Love the stripe.
          stripey = 0;
          for (ny = y - 3; (ny <= (y + 3)); ny++) {
            for (nx = x - 3; (nx <= (x + 3)); nx++) {
              if ((nx < 0) || (nx >= width) || (ny < 0) || (ny >= height)) {
                continue;
              }
              if (map[ny][nx] === 'S') {
                stripey++;
                break;
              }
            }
          }
          // An isolated pixel of stripe is not enough!
          if (!stripey) {
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
  self.measureFitness = function(map) {
    var x, y;
    var fitness = 0;
    for (y = 0; (y < map.length); y++) {
      var s = '';
      for (x = 0; (x < map[y].length); x++) {
        if (map[y][x] === 'B') {
          fitness++;
        }
      }
    }
    return fitness;
  };
}
