'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBorder = exports.BORDER_SIDES = exports.BORDER_STYLE = void 0;

var _Color = _interopRequireDefault(require("../Color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BORDER_STYLE = {
  NONE: 0,
  SOLID: 1
};
exports.BORDER_STYLE = BORDER_STYLE;
var BORDER_SIDES = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
};
exports.BORDER_SIDES = BORDER_SIDES;
var SIDES = Object.keys(BORDER_SIDES).map(function (s) {
  return s.toLowerCase();
});

var parseBorderStyle = function parseBorderStyle(style) {
  switch (style) {
    case 'none':
      return BORDER_STYLE.NONE;
  }

  return BORDER_STYLE.SOLID;
};

var parseBorder = function parseBorder(style) {
  return SIDES.map(function (side) {
    var borderColor = new _Color.default(style.getPropertyValue("border-".concat(side, "-color")));
    var borderStyle = parseBorderStyle(style.getPropertyValue("border-".concat(side, "-style")));
    var borderWidth = parseFloat(style.getPropertyValue("border-".concat(side, "-width")));
    return {
      borderColor: borderColor,
      borderStyle: borderStyle,
      borderWidth: isNaN(borderWidth) ? 0 : borderWidth
    };
  });
};

exports.parseBorder = parseBorder;