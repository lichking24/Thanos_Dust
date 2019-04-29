'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOverflowWrap = exports.OVERFLOW_WRAP = void 0;
var OVERFLOW_WRAP = {
  NORMAL: 0,
  BREAK_WORD: 1
};
exports.OVERFLOW_WRAP = OVERFLOW_WRAP;

var parseOverflowWrap = function parseOverflowWrap(overflow) {
  switch (overflow) {
    case 'break-word':
      return OVERFLOW_WRAP.BREAK_WORD;

    case 'normal':
    default:
      return OVERFLOW_WRAP.NORMAL;
  }
};

exports.parseOverflowWrap = parseOverflowWrap;