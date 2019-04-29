'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SMALL_IMAGE = exports.copyCSSStyles = exports.distance = exports.contains = void 0;

var contains = function contains(bit, value) {
  return (bit & value) !== 0;
};

exports.contains = contains;

var distance = function distance(a, b) {
  return Math.sqrt(a * a + b * b);
};

exports.distance = distance;

var copyCSSStyles = function copyCSSStyles(style, target) {
  // Edge does not provide value for cssText
  for (var i = style.length - 1; i >= 0; i--) {
    var property = style.item(i); // Safari shows pseudoelements if content is set

    if (property !== 'content') {
      target.style.setProperty(property, style.getPropertyValue(property));
    }
  }

  return target;
};

exports.copyCSSStyles = copyCSSStyles;
var SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
exports.SMALL_IMAGE = SMALL_IMAGE;