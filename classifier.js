module.exports = function() {
  new Classifier();
};

function Classifier() {
  var self = this;
  // Returns an object with the following boolean properties:
  // box: the black box is in the image
  // runway: the runway is in the image
  // strip: the strip is in the image
  self.classify = function(pixels) {

  }
}
