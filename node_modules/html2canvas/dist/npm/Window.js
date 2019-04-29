'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderElement = void 0;

var _Logger = _interopRequireDefault(require("./Logger"));

var _NodeParser = require("./NodeParser");

var _Renderer = _interopRequireDefault(require("./Renderer"));

var _ForeignObjectRenderer = _interopRequireDefault(require("./renderer/ForeignObjectRenderer"));

var _Feature = _interopRequireDefault(require("./Feature"));

var _Bounds = require("./Bounds");

var _Clone = require("./Clone");

var _Font = require("./Font");

var _Color = _interopRequireWildcard(require("./Color"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var renderElement = function renderElement(element, options, logger) {
  var ownerDocument = element.ownerDocument;
  var windowBounds = new _Bounds.Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight); // http://www.w3.org/TR/css3-background/#special-backgrounds

  var documentBackgroundColor = ownerDocument.documentElement ? new _Color.default(getComputedStyle(ownerDocument.documentElement).backgroundColor) : _Color.TRANSPARENT;
  var bodyBackgroundColor = ownerDocument.body ? new _Color.default(getComputedStyle(ownerDocument.body).backgroundColor) : _Color.TRANSPARENT;
  var backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new _Color.default(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new _Color.default(options.backgroundColor) : null;
  return (options.foreignObjectRendering ? // $FlowFixMe
  _Feature.default.SUPPORT_FOREIGNOBJECT_DRAWING : Promise.resolve(false)).then(function (supportForeignObject) {
    return supportForeignObject ? function (cloner) {
      if (process.env.NODE_ENV !== "production") {
        logger.log("Document cloned, using foreignObject rendering");
      }

      return cloner.inlineFonts(ownerDocument).then(function () {
        return cloner.resourceLoader.ready();
      }).then(function () {
        var renderer = new _ForeignObjectRenderer.default(cloner.documentElement);
        var defaultView = ownerDocument.defaultView;
        var scrollX = defaultView.pageXOffset;
        var scrollY = defaultView.pageYOffset;
        var isDocument = element.tagName === 'HTML' || element.tagName === 'BODY';

        var _ref = isDocument ? (0, _Bounds.parseDocumentSize)(ownerDocument) : (0, _Bounds.parseBounds)(element, scrollX, scrollY),
            width = _ref.width,
            height = _ref.height,
            left = _ref.left,
            top = _ref.top;

        return renderer.render({
          backgroundColor: backgroundColor,
          logger: logger,
          scale: options.scale,
          x: typeof options.x === 'number' ? options.x : left,
          y: typeof options.y === 'number' ? options.y : top,
          width: typeof options.width === 'number' ? options.width : Math.ceil(width),
          height: typeof options.height === 'number' ? options.height : Math.ceil(height),
          windowWidth: options.windowWidth,
          windowHeight: options.windowHeight,
          scrollX: options.scrollX,
          scrollY: options.scrollY
        });
      });
    }(new _Clone.DocumentCloner(element, options, logger, true, renderElement)) : (0, _Clone.cloneWindow)(ownerDocument, windowBounds, element, options, logger, renderElement).then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 3),
          container = _ref3[0],
          clonedElement = _ref3[1],
          resourceLoader = _ref3[2];

      if (process.env.NODE_ENV !== "production") {
        logger.log("Document cloned, using computed rendering");
      }

      var stack = (0, _NodeParser.NodeParser)(clonedElement, resourceLoader, logger);
      var clonedDocument = clonedElement.ownerDocument;

      if (backgroundColor === stack.container.style.background.backgroundColor) {
        stack.container.style.background.backgroundColor = _Color.TRANSPARENT;
      }

      return resourceLoader.ready().then(function (imageStore) {
        var fontMetrics = new _Font.FontMetrics(clonedDocument);

        if (process.env.NODE_ENV !== "production") {
          logger.log("Starting renderer");
        }

        var defaultView = clonedDocument.defaultView;
        var scrollX = defaultView.pageXOffset;
        var scrollY = defaultView.pageYOffset;
        var isDocument = clonedElement.tagName === 'HTML' || clonedElement.tagName === 'BODY';

        var _ref4 = isDocument ? (0, _Bounds.parseDocumentSize)(ownerDocument) : (0, _Bounds.parseBounds)(clonedElement, scrollX, scrollY),
            width = _ref4.width,
            height = _ref4.height,
            left = _ref4.left,
            top = _ref4.top;

        var renderOptions = {
          backgroundColor: backgroundColor,
          fontMetrics: fontMetrics,
          imageStore: imageStore,
          logger: logger,
          scale: options.scale,
          x: typeof options.x === 'number' ? options.x : left,
          y: typeof options.y === 'number' ? options.y : top,
          width: typeof options.width === 'number' ? options.width : Math.ceil(width),
          height: typeof options.height === 'number' ? options.height : Math.ceil(height)
        };

        if (Array.isArray(options.target)) {
          return Promise.all(options.target.map(function (target) {
            var renderer = new _Renderer.default(target, renderOptions);
            return renderer.render(stack);
          }));
        } else {
          var renderer = new _Renderer.default(options.target, renderOptions);
          var canvas = renderer.render(stack);

          if (options.removeContainer === true) {
            if (container.parentNode) {
              container.parentNode.removeChild(container);
            } else if (process.env.NODE_ENV !== "production") {
              logger.log("Cannot detach cloned iframe as it is not in the DOM anymore");
            }
          }

          return canvas;
        }
      });
    });
  });
};

exports.renderElement = renderElement;