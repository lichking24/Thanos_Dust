'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePosition = exports.POSITION = void 0;
var POSITION = {
  STATIC: 0,
  RELATIVE: 1,
  ABSOLUTE: 2,
  FIXED: 3,
  STICKY: 4
};
exports.POSITION = POSITION;

var parsePosition = function parsePosition(position) {
  switch (position) {
    case 'relative':
      return POSITION.RELATIVE;

    case 'absolute':
      return POSITION.ABSOLUTE;

    case 'fixed':
      return POSITION.FIXED;

    case 'sticky':
      return POSITION.STICKY;
  }

  return POSITION.STATIC;
};

exports.parsePosition = parsePosition;