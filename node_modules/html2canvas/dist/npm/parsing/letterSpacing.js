'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLetterSpacing = void 0;

var parseLetterSpacing = function parseLetterSpacing(letterSpacing) {
  if (letterSpacing === 'normal') {
    return 0;
  }

  var value = parseFloat(letterSpacing);
  return isNaN(value) ? 0 : value;
};

exports.parseLetterSpacing = parseLetterSpacing;