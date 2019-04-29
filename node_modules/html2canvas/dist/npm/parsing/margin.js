'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMargin = void 0;

var _Length = _interopRequireDefault(require("../Length"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SIDES = ['top', 'right', 'bottom', 'left'];

var parseMargin = function parseMargin(style) {
  return SIDES.map(function (side) {
    return new _Length.default(style.getPropertyValue("margin-".concat(side)));
  });
};

exports.parseMargin = parseMargin;