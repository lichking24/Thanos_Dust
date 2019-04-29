'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _textTransform = require("./parsing/textTransform");

var _TextBounds = require("./TextBounds");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TextContainer =
/*#__PURE__*/
function () {
  function TextContainer(text, parent, bounds) {
    _classCallCheck(this, TextContainer);

    this.text = text;
    this.parent = parent;
    this.bounds = bounds;
  }

  _createClass(TextContainer, null, [{
    key: "fromTextNode",
    value: function fromTextNode(node, parent) {
      var text = transform(node.data, parent.style.textTransform);
      return new TextContainer(text, parent, (0, _TextBounds.parseTextBounds)(text, parent, node));
    }
  }]);

  return TextContainer;
}();

exports.default = TextContainer;
var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;

var transform = function transform(text, _transform) {
  switch (_transform) {
    case _textTransform.TEXT_TRANSFORM.LOWERCASE:
      return text.toLowerCase();

    case _textTransform.TEXT_TRANSFORM.CAPITALIZE:
      return text.replace(CAPITALIZE, capitalize);

    case _textTransform.TEXT_TRANSFORM.UPPERCASE:
      return text.toUpperCase();

    default:
      return text;
  }
};

function capitalize(m, p1, p2) {
  if (m.length > 0) {
    return p1 + p2.toUpperCase();
  }

  return m;
}

module.exports = exports.default;