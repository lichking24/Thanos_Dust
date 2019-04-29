"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSerializedSVG = exports.createForeignObjectSVG = exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ForeignObjectRenderer =
/*#__PURE__*/
function () {
  function ForeignObjectRenderer(element) {
    _classCallCheck(this, ForeignObjectRenderer);

    this.element = element;
  }

  _createClass(ForeignObjectRenderer, [{
    key: "render",
    value: function render(options) {
      var _this = this;

      this.options = options;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = Math.floor(options.width) * options.scale;
      this.canvas.height = Math.floor(options.height) * options.scale;
      this.canvas.style.width = "".concat(options.width, "px");
      this.canvas.style.height = "".concat(options.height, "px");
      this.ctx.scale(options.scale, options.scale);
      options.logger.log("ForeignObject renderer initialized (".concat(options.width, "x").concat(options.height, " at ").concat(options.x, ",").concat(options.y, ") with scale ").concat(options.scale));
      var svg = createForeignObjectSVG(Math.max(options.windowWidth, options.width) * options.scale, Math.max(options.windowHeight, options.height) * options.scale, options.scrollX * options.scale, options.scrollY * options.scale, this.element);
      return loadSerializedSVG(svg).then(function (img) {
        if (options.backgroundColor) {
          _this.ctx.fillStyle = options.backgroundColor.toString();

          _this.ctx.fillRect(0, 0, options.width * options.scale, options.height * options.scale);
        }

        _this.ctx.drawImage(img, -options.x * options.scale, -options.y * options.scale);

        return _this.canvas;
      });
    }
  }]);

  return ForeignObjectRenderer;
}();

exports.default = ForeignObjectRenderer;

var createForeignObjectSVG = function createForeignObjectSVG(width, height, x, y, node) {
  var xmlns = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(xmlns, 'svg');
  var foreignObject = document.createElementNS(xmlns, 'foreignObject');
  svg.setAttributeNS(null, 'width', width);
  svg.setAttributeNS(null, 'height', height);
  foreignObject.setAttributeNS(null, 'width', '100%');
  foreignObject.setAttributeNS(null, 'height', '100%');
  foreignObject.setAttributeNS(null, 'x', x);
  foreignObject.setAttributeNS(null, 'y', y);
  foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
  svg.appendChild(foreignObject);
  foreignObject.appendChild(node);
  return svg;
};

exports.createForeignObjectSVG = createForeignObjectSVG;

var loadSerializedSVG = function loadSerializedSVG(svg) {
  return new Promise(function (resolve, reject) {
    var img = new Image();

    img.onload = function () {
      return resolve(img);
    };

    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8,".concat(encodeURIComponent(new XMLSerializer().serializeToString(svg)));
  });
};

exports.loadSerializedSVG = loadSerializedSVG;