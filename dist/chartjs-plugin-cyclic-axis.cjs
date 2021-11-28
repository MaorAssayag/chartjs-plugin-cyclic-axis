'use strict';

var chart_js = require('chart.js');
var zoomPlugin = require('chartjs-plugin-zoom');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var zoomPlugin__default = /*#__PURE__*/_interopDefaultLegacy(zoomPlugin);

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

/**
 * CyclicAxis is a Derived Axis Type for ChartJS.
 *
 * CyclicAxis enable us to customize the behavior of linear ticks on the graph,
 * when we do not necessarily want the initial tic value to be the minimum possible value.
 *
 * In addition this derived type enable the user to utilize chartjs-plugin-zoom and override the pannig function for continues, infinite cyclic panning.
 *
 * @since      1.0.0
 * @access     public
 * @alias    CyclicAxis
 * @memberof Scale
 * @link  URL
 * @param {number} options.max max value of tick range
 * @param {number} options.min min value of tick range
 * @param {number} options.rightValue initialize tick value on the right of the graph
 * @param {number} options.ticks.stepSize diff between ticks
 */

var cyclicAxisPlugin = /*#__PURE__*/function (_Scale) {
  _inherits(cyclicAxisPlugin, _Scale);

  var _super = _createSuper(cyclicAxisPlugin);

  /**
   * DEFAULT VALUES
   * [-180, 180] values range
   * 0 in the middle of the graph
   * tick resolution 5 units
   */
  function cyclicAxisPlugin(cfg) {
    var _this;

    _classCallCheck(this, cyclicAxisPlugin);

    _this = _super.call(this, cfg);

    _defineProperty(_assertThisInitialized(_this), "maxValue", 180);

    _defineProperty(_assertThisInitialized(_this), "minValue", -180);

    _defineProperty(_assertThisInitialized(_this), "rightValue", 180);

    _defineProperty(_assertThisInitialized(_this), "tickResolution", 5);

    _defineProperty(_assertThisInitialized(_this), "cyclicPanning", false);

    _defineProperty(_assertThisInitialized(_this), "pxPerUnit", 0);

    _this._valueRange = 0;

    _this.initConfig(cfg);

    return _this;
  }
  /**
   * You can extend chartjs-plugin-zoom with support for custom scales by using the zoom plugin's zoomFunctions and panFunctions members. These objects are indexed by scale types (scales' id members) and give optional handlers for zoom and pan functionality.
   */


  _createClass(cyclicAxisPlugin, [{
    key: "overridePanningFunction",
    value: function overridePanningFunction(override) {
      /**
       * return true to accumulate delta, false to reset it
       */
      if (override) {
        zoomPlugin__default['default'].panFunctions.cyclicAxis = function (scale, delta, _) {
          // console.log('delta ', delta, ' limits ', limits);
          var prevRightValue = scale.rightValue,
              pxPerUnit = scale.pxPerUnit;

          if (Math.abs(delta) > pxPerUnit) {
            var newRightValue = prevRightValue - (delta > 0 ? 2 : -2);

            if (newRightValue >= scale.maxValue) {
              newRightValue = scale.minValue;
            } else if (newRightValue <= scale.minValue) {
              newRightValue = scale.maxValue;
            }

            scale.options.rightValue = newRightValue;
            return true;
          }

          return false;
        };
      }
    }
  }, {
    key: "initConfig",
    value: function initConfig(cfg) {
      // Find current axis options
      var options = cfg.chart.config.options.scales[cfg.id];

      if (options != null) {
        this.maxValue = isFinite(options.max) ? options.max : this.maxValue;
        this.minValue = isFinite(options.min) ? options.min : this.minValue;
        this.rightValue = isFinite(options.rightValue) ? options.rightValue : this.rightValue;
        this.tickResolution = isFinite(options.ticks.stepSize) ? options.ticks.stepSize : this.tickResolution;
        this.cyclicPanning = isNaN(options.cyclicPanning) || typeof options.cyclicPanning != 'boolean' ? this.cyclicPanning : options.cyclicPanning; // Override panning function

        this.overridePanningFunction(this.cyclicPanning); // Validation

        if (this.maxValue < this.minValue) {
          throw new Error("Illegal Cycle Axis configuration. max value '".concat(this.maxValue, "' cannot be smaller than min value '").concat(this.minValue, "'!"));
        }

        if (this.rightValue < 0) {
          throw new Error("Illegal Cycle Axis configuration. rightValue '".concat(this.rightValue, "' cannot be negative!"));
        }

        if (this.rightValue > this.maxValue || this.rightValue < this.minValue) {
          throw new Error("Illegal Cycle Axis configuration. rightValue '".concat(this.rightValue, "' cannot be out of range [").concat(this.minValue, ",").concat(this.maxValue, "]!"));
        }

        if (this.tickResolution > this.maxValue - this.minValue) {
          throw new Error("Illegal Cycle Axis configuration. tickResolution '".concat(this.rightValue, "' too big for the value range [").concat(this.minValue, ",").concat(this.maxValue, "]!"));
        }
      }
    }
  }, {
    key: "parse",
    value: function parse(raw, index) {
      var value = chart_js.LinearScale.prototype.parse.apply(this, [raw, index]);
      return isFinite(value) && value >= this.minValue ? value : null;
    }
  }, {
    key: "determineDataLimits",
    value: function determineDataLimits() {
      this.min = this.minValue;
      this.max = this.maxValue;
    }
  }, {
    key: "buildTicks",
    value: function buildTicks() {
      var ticks = [];

      for (var i = this.min; i < this.max + 1; i = i + this.tickResolution) {
        ticks.push({
          value: i
        });
      }

      ticks = this.arrayRotate(ticks, (this.maxValue - this.rightValue) / this.tickResolution, true); // console.log('ticks: ', ticks);

      return ticks;
    }
    /**
     * @protected
     */

  }, {
    key: "configure",
    value: function configure() {
      _get(_getPrototypeOf(cyclicAxisPlugin.prototype), "configure", this).call(this); // Called on chart update / panFunctions end


      this._valueRange = this.maxValue - this.minValue;
      this.rightValue = this.options.rightValue;
      this.pxPerUnit = this.getPxPerUnit();
    }
  }, {
    key: "getPxPerUnit",
    value: function getPxPerUnit() {
      var u1 = this.ticks[this.ticks.length - 1].value;
      var u2 = this.ticks[this.ticks.length - 2].value;
      var diff = Math.abs(u1 - u2);
      return (this.getPixelForValue(u1) - this.getPixelForValue(u2)) / diff;
    }
  }, {
    key: "getPixelForValue",
    value: function getPixelForValue(value) {
      if (value === undefined || value === 0) {
        value = this.min;
      }

      var startValue = this.maxValue - this.rightValue;
      var offset = this.rightValue === this.maxValue ? 0 : value <= this.rightValue ? -startValue : this.rightValue - this.minValue;
      var negOffset = this.minValue < 0 ? -this.minValue : 0;
      var decimal = (value - offset + negOffset) / this._valueRange;
      return this.getPixelForDecimal(decimal);
    }
  }, {
    key: "getValueForPixel",
    value: function getValueForPixel(pixel) {
      var decimal = this.getDecimalForPixel(pixel);
      var startValue = this.maxValue - this.rightValue;
      var negOffset = this.minValue < 0 ? -this.minValue : 0;
      var zeroPixel = this.getPixelForDecimal(startValue);
      var offset = zeroPixel < pixel ? this.rightValue - this.minValue : -startValue;
      return offset - negOffset + decimal * this._valueRange;
    }
  }, {
    key: "arrayRotate",
    value: function arrayRotate(arr, times, reverse) {
      for (var i = 0; i < times; i++) {
        if (reverse) arr.unshift(arr.pop());else arr.push(arr.shift());
      }

      return arr;
    }
  }]);

  return cyclicAxisPlugin;
}(chart_js.Scale);

cyclicAxisPlugin.id = 'cyclicAxis';
cyclicAxisPlugin.defaults = {};
module.exports = cyclicAxisPlugin;
