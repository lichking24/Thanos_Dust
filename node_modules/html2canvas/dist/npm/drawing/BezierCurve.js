'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Path = require("./Path");

var _Vector = _interopRequireDefault(require("./Vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var lerp = function lerp(a, b, t) {
  return new _Vector.default(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

var BezierCurve =
/*#__PURE__*/
function () {
  function BezierCurve(start, startControl, endControl, end) {
    _classCallCheck(this, BezierCurve);

    this.type = _Path.PATH.BEZIER_CURVE;
    this.start = start;
    this.startControl = startControl;
    this.endControl = endControl;
    this.end = end;
  }

  _createClass(BezierCurve, [{
    key: "subdivide",
    value: function subdivide(t, firstHalf) {
      var ab = lerp(this.start, this.startControl, t);
      var bc = lerp(this.startControl, this.endControl, t);
      var cd = lerp(this.endControl, this.end, t);
      var abbc = lerp(ab, bc, t);
      var bccd = lerp(bc, cd, t);
      var dest = lerp(abbc, bccd, t);
      return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
    }
  }, {
    key: "reverse",
    value: function reverse() {
      return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
    }
  }]);

  return BezierCurve;
}();

exports.default = BezierCurve;
module.exports = exports.default;