'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reformatInputBounds = exports.inlineSelectElement = exports.inlineTextAreaElement = exports.inlineInputElement = exports.getInputBorderRadius = exports.INPUT_BACKGROUND = exports.INPUT_BORDERS = exports.INPUT_COLOR = void 0;

var _TextContainer = _interopRequireDefault(require("./TextContainer"));

var _background = require("./parsing/background");

var _border = require("./parsing/border");

var _Circle = _interopRequireDefault(require("./drawing/Circle"));

var _Vector = _interopRequireDefault(require("./drawing/Vector"));

var _Color = _interopRequireDefault(require("./Color"));

var _Length = _interopRequireDefault(require("./Length"));

var _Bounds = require("./Bounds");

var _TextBounds = require("./TextBounds");

var _Util = require("./Util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INPUT_COLOR = new _Color.default([42, 42, 42]);
exports.INPUT_COLOR = INPUT_COLOR;
var INPUT_BORDER_COLOR = new _Color.default([165, 165, 165]);
var INPUT_BACKGROUND_COLOR = new _Color.default([222, 222, 222]);
var INPUT_BORDER = {
  borderWidth: 1,
  borderColor: INPUT_BORDER_COLOR,
  borderStyle: _border.BORDER_STYLE.SOLID
};
var INPUT_BORDERS = [INPUT_BORDER, INPUT_BORDER, INPUT_BORDER, INPUT_BORDER];
exports.INPUT_BORDERS = INPUT_BORDERS;
var INPUT_BACKGROUND = {
  backgroundColor: INPUT_BACKGROUND_COLOR,
  backgroundImage: [],
  backgroundClip: _background.BACKGROUND_CLIP.PADDING_BOX,
  backgroundOrigin: _background.BACKGROUND_ORIGIN.PADDING_BOX
};
exports.INPUT_BACKGROUND = INPUT_BACKGROUND;
var RADIO_BORDER_RADIUS = new _Length.default('50%');
var RADIO_BORDER_RADIUS_TUPLE = [RADIO_BORDER_RADIUS, RADIO_BORDER_RADIUS];
var INPUT_RADIO_BORDER_RADIUS = [RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE];
var CHECKBOX_BORDER_RADIUS = new _Length.default('3px');
var CHECKBOX_BORDER_RADIUS_TUPLE = [CHECKBOX_BORDER_RADIUS, CHECKBOX_BORDER_RADIUS];
var INPUT_CHECKBOX_BORDER_RADIUS = [CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE];

var getInputBorderRadius = function getInputBorderRadius(node) {
  return node.type === 'radio' ? INPUT_RADIO_BORDER_RADIUS : INPUT_CHECKBOX_BORDER_RADIUS;
};

exports.getInputBorderRadius = getInputBorderRadius;

var inlineInputElement = function inlineInputElement(node, container) {
  if (node.type === 'radio' || node.type === 'checkbox') {
    if (node.checked) {
      var size = Math.min(container.bounds.width, container.bounds.height);
      container.childNodes.push(node.type === 'checkbox' ? [new _Vector.default(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79), new _Vector.default(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549), new _Vector.default(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071), new _Vector.default(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649), new _Vector.default(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23), new _Vector.default(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085), new _Vector.default(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)] : new _Circle.default(container.bounds.left + size / 4, container.bounds.top + size / 4, size / 4));
    }
  } else {
    inlineFormElement(getInputValue(node), node, container, false);
  }
};

exports.inlineInputElement = inlineInputElement;

var inlineTextAreaElement = function inlineTextAreaElement(node, container) {
  inlineFormElement(node.value, node, container, true);
};

exports.inlineTextAreaElement = inlineTextAreaElement;

var inlineSelectElement = function inlineSelectElement(node, container) {
  var option = node.options[node.selectedIndex || 0];
  inlineFormElement(option ? option.text || '' : '', node, container, false);
};

exports.inlineSelectElement = inlineSelectElement;

var reformatInputBounds = function reformatInputBounds(bounds) {
  if (bounds.width > bounds.height) {
    bounds.left += (bounds.width - bounds.height) / 2;
    bounds.width = bounds.height;
  } else if (bounds.width < bounds.height) {
    bounds.top += (bounds.height - bounds.width) / 2;
    bounds.height = bounds.width;
  }

  return bounds;
};

exports.reformatInputBounds = reformatInputBounds;

var inlineFormElement = function inlineFormElement(value, node, container, allowLinebreak) {
  var body = node.ownerDocument.body;

  if (value.length > 0 && body) {
    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    (0, _Util.copyCSSStyles)(node.ownerDocument.defaultView.getComputedStyle(node, null), wrapper);
    wrapper.style.position = 'absolute';
    wrapper.style.left = "".concat(container.bounds.left, "px");
    wrapper.style.top = "".concat(container.bounds.top, "px");

    if (!allowLinebreak) {
      wrapper.style.whiteSpace = 'nowrap';
    }

    var text = node.ownerDocument.createTextNode(value);
    wrapper.appendChild(text);
    body.appendChild(wrapper);
    container.childNodes.push(_TextContainer.default.fromTextNode(text, container));
    body.removeChild(wrapper);
  }
};

var getInputValue = function getInputValue(node) {
  var value = node.type === 'password' ? new Array(node.value.length + 1).join("\u2022") : node.value;
  return value.length === 0 ? node.placeholder || '' : value;
};