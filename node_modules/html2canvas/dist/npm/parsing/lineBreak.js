'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLineBreak = exports.LINE_BREAK = void 0;
var LINE_BREAK = {
  NORMAL: 'normal',
  STRICT: 'strict'
};
exports.LINE_BREAK = LINE_BREAK;

var parseLineBreak = function parseLineBreak(wordBreak) {
  switch (wordBreak) {
    case 'strict':
      return LINE_BREAK.STRICT;

    case 'normal':
    default:
      return LINE_BREAK.NORMAL;
  }
};

exports.parseLineBreak = parseLineBreak;