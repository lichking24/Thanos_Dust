'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePadding = exports.PADDING_SIDES = void 0;

var _Length = _interopRequireDefault(require("../Length"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PADDING_SIDES = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3
};
exports.PADDING_SIDES = PADDING_SIDES;
var SIDES = ['top', 'right', 'bottom', 'left'];

var parsePadding = function parsePadding(style) {
  return SIDES.map(function (side) {
    return new _Length.default(style.getPropertyValue("padding-".concat(side)));
  });
};

exports.parsePadding = parsePadding;