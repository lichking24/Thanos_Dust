'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseZIndex = void 0;

var parseZIndex = function parseZIndex(zIndex) {
  var auto = zIndex === 'auto';
  return {
    auto: auto,
    order: auto ? 0 : parseInt(zIndex, 10)
  };
};

exports.parseZIndex = parseZIndex;