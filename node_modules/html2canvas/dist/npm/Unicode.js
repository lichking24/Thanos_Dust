'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "toCodePoints", {
  enumerable: true,
  get: function get() {
    return _cssLineBreak.toCodePoints;
  }
});
Object.defineProperty(exports, "fromCodePoint", {
  enumerable: true,
  get: function get() {
    return _cssLineBreak.fromCodePoint;
  }
});
exports.breakWords = void 0;

var _cssLineBreak = require("css-line-break");

var _overflowWrap = require("./parsing/overflowWrap");

var breakWords = function breakWords(str, parent) {
  var breaker = (0, _cssLineBreak.LineBreaker)(str, {
    lineBreak: parent.style.lineBreak,
    wordBreak: parent.style.overflowWrap === _overflowWrap.OVERFLOW_WRAP.BREAK_WORD ? 'break-word' : parent.style.wordBreak
  });
  var words = [];
  var bk;

  while (!(bk = breaker.next()).done) {
    words.push(bk.value.slice());
  }

  return words;
};

exports.breakWords = breakWords;