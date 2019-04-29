'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logger =
/*#__PURE__*/
function () {
  function Logger(enabled, id, start) {
    _classCallCheck(this, Logger);

    this.enabled = typeof window !== 'undefined' && enabled;
    this.start = start ? start : Date.now();
    this.id = id;
  }

  _createClass(Logger, [{
    key: "child",
    value: function child(id) {
      return new Logger(this.enabled, id, this.start);
    } // eslint-disable-next-line flowtype/no-weak-types

  }, {
    key: "log",
    value: function log() {
      if (this.enabled && window.console && window.console.log) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? "html2canvas (".concat(this.id, "):") : 'html2canvas:'].concat([].slice.call(args, 0)));
      }
    } // eslint-disable-next-line flowtype/no-weak-types

  }, {
    key: "error",
    value: function error() {
      if (this.enabled && window.console && window.console.error) {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        Function.prototype.bind.call(window.console.error, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? "html2canvas (".concat(this.id, "):") : 'html2canvas:'].concat([].slice.call(args, 0)));
      }
    }
  }]);

  return Logger;
}();

exports.default = Logger;
module.exports = exports.default;