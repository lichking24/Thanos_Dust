'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _NodeContainer = _interopRequireDefault(require("./NodeContainer"));

var _position = require("./parsing/position");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StackingContext =
/*#__PURE__*/
function () {
  function StackingContext(container, parent, treatAsRealStackingContext) {
    _classCallCheck(this, StackingContext);

    this.container = container;
    this.parent = parent;
    this.contexts = [];
    this.children = [];
    this.treatAsRealStackingContext = treatAsRealStackingContext;
  }

  _createClass(StackingContext, [{
    key: "getOpacity",
    value: function getOpacity() {
      return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity;
    }
  }, {
    key: "getRealParentStackingContext",
    value: function getRealParentStackingContext() {
      return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext();
    }
  }]);

  return StackingContext;
}();

exports.default = StackingContext;
module.exports = exports.default;