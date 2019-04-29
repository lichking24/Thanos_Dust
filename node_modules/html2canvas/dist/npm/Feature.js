'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ForeignObjectRenderer = require("./renderer/ForeignObjectRenderer");

var testRangeBounds = function testRangeBounds(document) {
  var TEST_HEIGHT = 123;

  if (document.createRange) {
    var range = document.createRange();

    if (range.getBoundingClientRect) {
      var testElement = document.createElement('boundtest');
      testElement.style.height = "".concat(TEST_HEIGHT, "px");
      testElement.style.display = 'block';
      document.body.appendChild(testElement);
      range.selectNode(testElement);
      var rangeBounds = range.getBoundingClientRect();
      var rangeHeight = Math.round(rangeBounds.height);
      document.body.removeChild(testElement);

      if (rangeHeight === TEST_HEIGHT) {
        return true;
      }
    }
  }

  return false;
};

var testCORS = function testCORS() {
  return typeof new Image().crossOrigin !== 'undefined';
};

var testResponseType = function testResponseType() {
  return typeof new XMLHttpRequest().responseType === 'string';
};

var testSVG = function testSVG(document) {
  var img = new Image();
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

  try {
    ctx.drawImage(img, 0, 0);
    canvas.toDataURL();
  } catch (e) {
    return false;
  }

  return true;
};

var isGreenPixel = function isGreenPixel(data) {
  return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
};

var testForeignObject = function testForeignObject(document) {
  var canvas = document.createElement('canvas');
  var size = 100;
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(0, 255, 0)';
  ctx.fillRect(0, 0, size, size);
  var img = new Image();
  var greenImageSrc = canvas.toDataURL();
  img.src = greenImageSrc;
  var svg = (0, _ForeignObjectRenderer.createForeignObjectSVG)(size, size, 0, 0, img);
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, size, size);
  return (0, _ForeignObjectRenderer.loadSerializedSVG)(svg).then(function (img) {
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, size, size).data;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, size, size);
    var node = document.createElement('div');
    node.style.backgroundImage = "url(".concat(greenImageSrc, ")");
    node.style.height = "".concat(size, "px"); // Firefox 55 does not render inline <img /> tags

    return isGreenPixel(data) ? (0, _ForeignObjectRenderer.loadSerializedSVG)((0, _ForeignObjectRenderer.createForeignObjectSVG)(size, size, 0, 0, node)) : Promise.reject(false);
  }).then(function (img) {
    ctx.drawImage(img, 0, 0); // Edge does not render background-images

    return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
  }).catch(function (e) {
    return false;
  });
};

var FEATURES = {
  // $FlowFixMe - get/set properties not yet supported
  get SUPPORT_RANGE_BOUNDS() {
    'use strict';

    var value = testRangeBounds(document);
    Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', {
      value: value
    });
    return value;
  },

  // $FlowFixMe - get/set properties not yet supported
  get SUPPORT_SVG_DRAWING() {
    'use strict';

    var value = testSVG(document);
    Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', {
      value: value
    });
    return value;
  },

  // $FlowFixMe - get/set properties not yet supported
  get SUPPORT_FOREIGNOBJECT_DRAWING() {
    'use strict';

    var value = typeof Array.from === 'function' && typeof window.fetch === 'function' ? testForeignObject(document) : Promise.resolve(false);
    Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', {
      value: value
    });
    return value;
  },

  // $FlowFixMe - get/set properties not yet supported
  get SUPPORT_CORS_IMAGES() {
    'use strict';

    var value = testCORS();
    Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', {
      value: value
    });
    return value;
  },

  // $FlowFixMe - get/set properties not yet supported
  get SUPPORT_RESPONSE_TYPE() {
    'use strict';

    var value = testResponseType();
    Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', {
      value: value
    });
    return value;
  },

  // $FlowFixMe - get/set properties not yet supported
  get SUPPORT_CORS_XHR() {
    'use strict';

    var value = 'withCredentials' in new XMLHttpRequest();
    Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', {
      value: value
    });
    return value;
  }

};
var _default = FEATURES;
exports.default = _default;
module.exports = exports.default;