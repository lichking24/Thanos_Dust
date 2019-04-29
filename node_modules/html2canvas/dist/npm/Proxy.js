'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Proxy = void 0;

var _Feature = _interopRequireDefault(require("./Feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Proxy = function Proxy(src, options) {
  if (!options.proxy) {
    return Promise.reject(process.env.NODE_ENV !== "production" ? 'No proxy defined' : null);
  }

  var proxy = options.proxy;
  return new Promise(function (resolve, reject) {
    var responseType = _Feature.default.SUPPORT_CORS_XHR && _Feature.default.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
    var xhr = _Feature.default.SUPPORT_CORS_XHR ? new XMLHttpRequest() : new XDomainRequest();

    xhr.onload = function () {
      if (xhr instanceof XMLHttpRequest) {
        if (xhr.status === 200) {
          if (responseType === 'text') {
            resolve(xhr.response);
          } else {
            var reader = new FileReader(); // $FlowFixMe

            reader.addEventListener('load', function () {
              return resolve(reader.result);
            }, false); // $FlowFixMe

            reader.addEventListener('error', function (e) {
              return reject(e);
            }, false);
            reader.readAsDataURL(xhr.response);
          }
        } else {
          reject(process.env.NODE_ENV !== "production" ? "Failed to proxy resource ".concat(src.substring(0, 256), " with status code ").concat(xhr.status) : '');
        }
      } else {
        resolve(xhr.responseText);
      }
    };

    xhr.onerror = reject;
    xhr.open('GET', "".concat(proxy, "?url=").concat(encodeURIComponent(src), "&responseType=").concat(responseType));

    if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
      xhr.responseType = responseType;
    }

    if (options.imageTimeout) {
      var timeout = options.imageTimeout;
      xhr.timeout = timeout;

      xhr.ontimeout = function () {
        return reject(process.env.NODE_ENV !== "production" ? "Timed out (".concat(timeout, "ms) proxying ").concat(src.substring(0, 256)) : '');
      };
    }

    xhr.send();
  });
};

exports.Proxy = Proxy;