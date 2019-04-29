'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = require("url");

var _textDecoration2 = require("../parsing/textDecoration");

var _Path = require("../drawing/Path");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RefTestRenderer =
/*#__PURE__*/
function () {
  function RefTestRenderer() {
    _classCallCheck(this, RefTestRenderer);
  }

  _createClass(RefTestRenderer, [{
    key: "render",
    value: function render(options) {
      this.options = options;
      this.indent = 0;
      this.lines = [];
      options.logger.log("RefTest renderer initialized");
      this.writeLine("Window: [".concat(options.width, ", ").concat(options.height, "]"));
    }
  }, {
    key: "clip",
    value: function clip(clipPaths, callback) {
      this.writeLine("Clip: ".concat(clipPaths.map(this.formatPath, this).join(' | ')));
      this.indent += 2;
      callback();
      this.indent -= 2;
    }
  }, {
    key: "drawImage",
    value: function drawImage(image, source, destination) {
      this.writeLine("Draw image: ".concat(this.formatImage(image), " (source: ").concat(this.formatBounds(source), ") (destination: ").concat(this.formatBounds(source), ")"));
    }
  }, {
    key: "drawShape",
    value: function drawShape(path, color) {
      this.writeLine("Shape: ".concat(color.toString(), " ").concat(this.formatPath(path)));
    }
  }, {
    key: "fill",
    value: function fill(color) {
      this.writeLine("Fill: ".concat(color.toString()));
    }
  }, {
    key: "getTarget",
    value: function getTarget() {
      return Promise.resolve(this.lines.join('\n'));
    }
  }, {
    key: "rectangle",
    value: function rectangle(x, y, width, height, color) {
      var list = [x, y, width, height].map(function (v) {
        return Math.round(v);
      }).join(', ');
      this.writeLine("Rectangle: [".concat(list, "] ").concat(color.toString()));
    }
  }, {
    key: "formatBounds",
    value: function formatBounds(bounds) {
      var list = [bounds.left, bounds.top, bounds.width, bounds.height];
      return "[".concat(list.map(function (v) {
        return Math.round(v);
      }).join(', '), "]");
    }
  }, {
    key: "formatImage",
    value: function formatImage(image) {
      return image.tagName === 'CANVAS' ? 'Canvas' : // $FlowFixMe
      "Image (\"".concat((0, _url.parse)(image.src).pathname.substring(0, 100), "\")");
    }
  }, {
    key: "formatPath",
    value: function formatPath(path) {
      if (!Array.isArray(path)) {
        return "Circle(x: ".concat(Math.round(path.x), ", y: ").concat(Math.round(path.y), ", r: ").concat(Math.round(path.radius), ")");
      }

      var string = path.map(function (v) {
        if (v.type === _Path.PATH.VECTOR) {
          return "Vector(x: ".concat(Math.round(v.x), ", y: ").concat(Math.round(v.y), ")");
        }

        if (v.type === _Path.PATH.BEZIER_CURVE) {
          var values = ["x0: ".concat(Math.round(v.start.x)), "y0: ".concat(Math.round(v.start.y)), "x1: ".concat(Math.round(v.end.x)), "y1: ".concat(Math.round(v.end.y)), "cx0: ".concat(Math.round(v.startControl.x)), "cy0: ".concat(Math.round(v.startControl.y)), "cx1: ".concat(Math.round(v.endControl.x)), "cy1: ".concat(Math.round(v.endControl.y))];
          return "BezierCurve(".concat(values.join(', '), ")");
        }
      }).join(' > ');
      return "Path (".concat(string, ")");
    }
  }, {
    key: "renderLinearGradient",
    value: function renderLinearGradient(bounds, gradient) {
      var direction = ["x0: ".concat(Math.round(gradient.direction.x0)), "x1: ".concat(Math.round(gradient.direction.x1)), "y0: ".concat(Math.round(gradient.direction.y0)), "y1: ".concat(Math.round(gradient.direction.y1))];
      var stops = gradient.colorStops.map(function (stop) {
        return "".concat(stop.color.toString(), " ").concat(Math.ceil(stop.stop * 100) / 100);
      });
      this.writeLine("Gradient: ".concat(this.formatBounds(bounds), " linear-gradient(").concat(direction.join(', '), " ").concat(stops.join(', '), ")"));
    }
  }, {
    key: "renderRadialGradient",
    value: function renderRadialGradient(bounds, gradient) {
      var stops = gradient.colorStops.map(function (stop) {
        return "".concat(stop.color.toString(), " ").concat(Math.ceil(stop.stop * 100) / 100);
      });
      this.writeLine("RadialGradient: ".concat(this.formatBounds(bounds), " radial-gradient(").concat(gradient.radius.x, " ").concat(gradient.radius.y, " at ").concat(gradient.center.x, " ").concat(gradient.center.y, ", ").concat(stops.join(', '), ")"));
    }
  }, {
    key: "renderRepeat",
    value: function renderRepeat(path, image, imageSize, offsetX, offsetY) {
      this.writeLine("Repeat: ".concat(this.formatImage(image), " [").concat(Math.round(offsetX), ", ").concat(Math.round(offsetY), "] Size (").concat(Math.round(imageSize.width), ", ").concat(Math.round(imageSize.height), ") ").concat(this.formatPath(path)));
    }
  }, {
    key: "renderTextNode",
    value: function renderTextNode(textBounds, color, font, textDecoration, textShadows) {
      var _this = this;

      var fontString = [font.fontStyle, font.fontVariant, font.fontWeight, parseInt(font.fontSize, 10), font.fontFamily.replace(/"/g, '')].join(' ').split(',')[0];
      var textDecorationString = this.textDecoration(textDecoration, color);
      var shadowString = textShadows ? " Shadows: (".concat(textShadows.map(function (shadow) {
        return "".concat(shadow.color.toString(), " ").concat(shadow.offsetX, "px ").concat(shadow.offsetY, "px ").concat(shadow.blur, "px");
      }).join(', '), ")") : '';
      this.writeLine("Text: ".concat(color.toString(), " ").concat(fontString).concat(shadowString).concat(textDecorationString));
      this.indent += 2;
      textBounds.forEach(function (textBound) {
        _this.writeLine("[".concat(Math.round(textBound.bounds.left), ", ").concat(Math.round(textBound.bounds.top), "]: ").concat(textBound.text));
      });
      this.indent -= 2;
    }
  }, {
    key: "textDecoration",
    value: function textDecoration(_textDecoration, color) {
      if (_textDecoration) {
        var textDecorationColor = (_textDecoration.textDecorationColor ? _textDecoration.textDecorationColor : color).toString();

        var textDecorationLines = _textDecoration.textDecorationLine.map(this.textDecorationLine, this);

        return _textDecoration ? " ".concat(this.textDecorationStyle(_textDecoration.textDecorationStyle), " ").concat(textDecorationColor, " ").concat(textDecorationLines.join(', ')) : '';
      }

      return '';
    }
  }, {
    key: "textDecorationLine",
    value: function textDecorationLine(_textDecorationLine) {
      switch (_textDecorationLine) {
        case _textDecoration2.TEXT_DECORATION_LINE.LINE_THROUGH:
          return 'line-through';

        case _textDecoration2.TEXT_DECORATION_LINE.OVERLINE:
          return 'overline';

        case _textDecoration2.TEXT_DECORATION_LINE.UNDERLINE:
          return 'underline';

        case _textDecoration2.TEXT_DECORATION_LINE.BLINK:
          return 'blink';
      }

      return 'UNKNOWN';
    }
  }, {
    key: "textDecorationStyle",
    value: function textDecorationStyle(_textDecorationStyle) {
      switch (_textDecorationStyle) {
        case _textDecoration2.TEXT_DECORATION_STYLE.SOLID:
          return 'solid';

        case _textDecoration2.TEXT_DECORATION_STYLE.DOTTED:
          return 'dotted';

        case _textDecoration2.TEXT_DECORATION_STYLE.DOUBLE:
          return 'double';

        case _textDecoration2.TEXT_DECORATION_STYLE.DASHED:
          return 'dashed';

        case _textDecoration2.TEXT_DECORATION_STYLE.WAVY:
          return 'WAVY';
      }

      return 'UNKNOWN';
    }
  }, {
    key: "setOpacity",
    value: function setOpacity(opacity) {
      this.writeLine("Opacity: ".concat(opacity));
    }
  }, {
    key: "transform",
    value: function transform(offsetX, offsetY, matrix, callback) {
      this.writeLine("Transform: (".concat(Math.round(offsetX), ", ").concat(Math.round(offsetY), ") [").concat(matrix.map(function (v) {
        return Math.round(v * 100) / 100;
      }).join(', '), "]"));
      this.indent += 2;
      callback();
      this.indent -= 2;
    }
  }, {
    key: "writeLine",
    value: function writeLine(text) {
      this.lines.push("".concat(new Array(this.indent + 1).join(' ')).concat(text));
    }
  }]);

  return RefTestRenderer;
}();

exports.default = RefTestRenderer;
module.exports = exports.default;