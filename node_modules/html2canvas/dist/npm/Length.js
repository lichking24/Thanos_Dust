'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateLengthFromValueWithUnit = exports.default = exports.LENGTH_TYPE = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LENGTH_WITH_UNIT = /([\d.]+)(px|r?em|%)/i;
var LENGTH_TYPE = {
  PX: 0,
  PERCENTAGE: 1
};
exports.LENGTH_TYPE = LENGTH_TYPE;

var Length =
/*#__PURE__*/
function () {
  function Length(value) {
    _classCallCheck(this, Length);

    this.type = value.substr(value.length - 1) === '%' ? LENGTH_TYPE.PERCENTAGE : LENGTH_TYPE.PX;
    var parsedValue = parseFloat(value);

    if (process.env.NODE_ENV !== "production" && isNaN(parsedValue)) {
      console.error("Invalid value given for Length: \"".concat(value, "\""));
    }

    this.value = isNaN(parsedValue) ? 0 : parsedValue;
  }

  _createClass(Length, [{
    key: "isPercentage",
    value: function isPercentage() {
      return this.type === LENGTH_TYPE.PERCENTAGE;
    }
  }, {
    key: "getAbsoluteValue",
    value: function getAbsoluteValue(parentLength) {
      return this.isPercentage() ? parentLength * (this.value / 100) : this.value;
    }
  }], [{
    key: "create",
    value: function create(v) {
      return new Length(v);
    }
  }]);

  return Length;
}();

exports.default = Length;

var getRootFontSize = function getRootFontSize(container) {
  var parent = container.parent;
  return parent ? getRootFontSize(parent) : parseFloat(container.style.font.fontSize);
};

var calculateLengthFromValueWithUnit = function calculateLengthFromValueWithUnit(container, value, unit) {
  switch (unit) {
    case 'px':
    case '%':
      return new Length(value + unit);

    case 'em':
    case 'rem':
      var length = new Length(value);
      length.value *= unit === 'em' ? parseFloat(container.style.font.fontSize) : getRootFontSize(container);
      return length;

    default:
      // TODO: handle correctly if unknown unit is used
      return new Length('0');
  }
};

exports.calculateLengthFromValueWithUnit = calculateLengthFromValueWithUnit;