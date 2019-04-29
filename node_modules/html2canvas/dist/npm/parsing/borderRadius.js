'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBorderRadius = void 0;

var _Length = _interopRequireDefault(require("../Length"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SIDES = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

var parseBorderRadius = function parseBorderRadius(style) {
  return SIDES.map(function (side) {
    var value = style.getPropertyValue("border-".concat(side, "-radius"));

    var _value$split$map = value.split(' ').map(_Length.default.create),
        _value$split$map2 = _slicedToArray(_value$split$map, 2),
        horizontal = _value$split$map2[0],
        vertical = _value$split$map2[1];

    return typeof vertical === 'undefined' ? [horizontal, horizontal] : [horizontal, vertical];
  });
};

exports.parseBorderRadius = parseBorderRadius;