'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTextTransform = exports.TEXT_TRANSFORM = void 0;
var TEXT_TRANSFORM = {
  NONE: 0,
  LOWERCASE: 1,
  UPPERCASE: 2,
  CAPITALIZE: 3
};
exports.TEXT_TRANSFORM = TEXT_TRANSFORM;

var parseTextTransform = function parseTextTransform(textTransform) {
  switch (textTransform) {
    case 'uppercase':
      return TEXT_TRANSFORM.UPPERCASE;

    case 'lowercase':
      return TEXT_TRANSFORM.LOWERCASE;

    case 'capitalize':
      return TEXT_TRANSFORM.CAPITALIZE;
  }

  return TEXT_TRANSFORM.NONE;
};

exports.parseTextTransform = parseTextTransform;