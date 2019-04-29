'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseWordBreak = exports.WORD_BREAK = void 0;
var WORD_BREAK = {
  NORMAL: 'normal',
  BREAK_ALL: 'break-all',
  KEEP_ALL: 'keep-all'
};
exports.WORD_BREAK = WORD_BREAK;

var parseWordBreak = function parseWordBreak(wordBreak) {
  switch (wordBreak) {
    case 'break-all':
      return WORD_BREAK.BREAK_ALL;

    case 'keep-all':
      return WORD_BREAK.KEEP_ALL;

    case 'normal':
    default:
      return WORD_BREAK.NORMAL;
  }
};

exports.parseWordBreak = parseWordBreak;