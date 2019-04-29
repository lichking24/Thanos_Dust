'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseVisibility = exports.VISIBILITY = void 0;
var VISIBILITY = {
  VISIBLE: 0,
  HIDDEN: 1,
  COLLAPSE: 2
};
exports.VISIBILITY = VISIBILITY;

var parseVisibility = function parseVisibility(visibility) {
  switch (visibility) {
    case 'hidden':
      return VISIBILITY.HIDDEN;

    case 'collapse':
      return VISIBILITY.COLLAPSE;

    case 'visible':
    default:
      return VISIBILITY.VISIBLE;
  }
};

exports.parseVisibility = parseVisibility;