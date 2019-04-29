'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOverflow = exports.OVERFLOW = void 0;
var OVERFLOW = {
  VISIBLE: 0,
  HIDDEN: 1,
  SCROLL: 2,
  AUTO: 3
};
exports.OVERFLOW = OVERFLOW;

var parseOverflow = function parseOverflow(overflow) {
  switch (overflow) {
    case 'hidden':
      return OVERFLOW.HIDDEN;

    case 'scroll':
      return OVERFLOW.SCROLL;

    case 'auto':
      return OVERFLOW.AUTO;

    case 'visible':
    default:
      return OVERFLOW.VISIBLE;
  }
};

exports.parseOverflow = parseOverflow;