'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CanvasRenderer = _interopRequireDefault(require("./renderer/CanvasRenderer"));

var _Logger = _interopRequireDefault(require("./Logger"));

var _Window = require("./Window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var html2canvas = function html2canvas(element, conf) {
  var config = conf || {};
  var logger = new _Logger.default(typeof config.logging === 'boolean' ? config.logging : true);
  logger.log("html2canvas ".concat("$npm_package_version"));

  if (process.env.NODE_ENV !== "production" && typeof config.onrendered === 'function') {
    logger.error("onrendered option is deprecated, html2canvas returns a Promise with the canvas as the value");
  }

  var ownerDocument = element.ownerDocument;

  if (!ownerDocument) {
    return Promise.reject("Provided element is not within a Document");
  }

  var defaultView = ownerDocument.defaultView;
  var defaultOptions = {
    allowTaint: false,
    backgroundColor: '#ffffff',
    imageTimeout: 15000,
    logging: true,
    proxy: null,
    removeContainer: true,
    foreignObjectRendering: false,
    scale: defaultView.devicePixelRatio || 1,
    target: new _CanvasRenderer.default(config.canvas),
    useCORS: false,
    windowWidth: defaultView.innerWidth,
    windowHeight: defaultView.innerHeight,
    scrollX: defaultView.pageXOffset,
    scrollY: defaultView.pageYOffset
  };
  var result = (0, _Window.renderElement)(element, _objectSpread({}, defaultOptions, config), logger);

  if (process.env.NODE_ENV !== "production") {
    return result.catch(function (e) {
      logger.error(e);
      throw e;
    });
  }

  return result;
};

html2canvas.CanvasRenderer = _CanvasRenderer.default;
var _default = html2canvas;
exports.default = _default;
module.exports = exports.default;