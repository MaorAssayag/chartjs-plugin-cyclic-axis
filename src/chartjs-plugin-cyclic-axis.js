import { Scale, LinearScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

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
class cyclicAxisPlugin extends Scale {
    /**
     * DEFAULT VALUES
     * [-180, 180] values range
     * 0 in the middle of the graph
     * tick resolution 5 units
     */
    maxValue = 180;
    minValue = -180;
    rightValue = 180;
    tickResolution = 5;
    cyclicPanning = false;
    pxPerUnit = 0;

    constructor(cfg) {
        super(cfg);
        this._valueRange = 0;

        this.initConfig(cfg);
    }

    /**
     * You can extend chartjs-plugin-zoom with support for custom scales by using the zoom plugin's zoomFunctions and panFunctions members. These objects are indexed by scale types (scales' id members) and give optional handlers for zoom and pan functionality.
     */
    overridePanningFunction(override) {
        /**
         * return true to accumulate delta, false to reset it
         */
        if (override) {
            zoomPlugin.panFunctions.cyclicAxis = function(scale, delta, _) {
                // console.log('delta ', delta, ' limits ', limits);
                const { rightValue: prevRightValue, pxPerUnit: pxPerUnit } = scale;

                if (Math.abs(delta) > pxPerUnit) {
                    let newRightValue = prevRightValue - (delta > 0 ? 2 : -2);
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

    initConfig(cfg) {
        // Find current axis options
        const options = cfg.chart.config.options.scales[cfg.id];
        if (options != null) {
            this.maxValue = isFinite(options.max) ? options.max : this.maxValue;
            this.minValue = isFinite(options.min) ? options.min : this.minValue;
            this.rightValue = isFinite(options.rightValue)
                ? options.rightValue
                : this.rightValue;
            this.tickResolution = isFinite(options.ticks.stepSize)
                ? options.ticks.stepSize
                : this.tickResolution;
            this.cyclicPanning =
                isNaN(options.cyclicPanning) ||
                typeof options.cyclicPanning != 'boolean'
                    ? this.cyclicPanning
                    : options.cyclicPanning;

            // Override panning function
            this.overridePanningFunction(this.cyclicPanning);

            // Validation
            if (this.maxValue < this.minValue) {
                throw new Error(
                    `Illegal Cycle Axis configuration. max value '${
                        this.maxValue
                    }' cannot be smaller than min value '${this.minValue}'!`
                );
            }
            if (this.rightValue < 0) {
                throw new Error(
                    `Illegal Cycle Axis configuration. rightValue '${
                        this.rightValue
                    }' cannot be negative!`
                );
            }
            if (this.rightValue > this.maxValue || this.rightValue < this.minValue) {
                throw new Error(
                    `Illegal Cycle Axis configuration. rightValue '${
                        this.rightValue
                    }' cannot be out of range [${this.minValue},${this.maxValue}]!`
                );
            }
            if (this.tickResolution > this.maxValue - this.minValue) {
                throw new Error(
                    `Illegal Cycle Axis configuration. tickResolution '${
                        this.rightValue
                    }' too big for the value range [${this.minValue},${this.maxValue}]!`
                );
            }
        }
    }

    parse(raw, index) {
        const value = LinearScale.prototype.parse.apply(this, [raw, index]);
        return isFinite(value) && value >= this.minValue ? value : null;
    }

    determineDataLimits() {
        this.min = this.minValue;
        this.max = this.maxValue;
    }

    buildTicks() {
        let ticks = [];
        for (let i = this.min; i < this.max + 1; i = i + this.tickResolution) {
            ticks.push({ value: i });
        }
        ticks = this.arrayRotate(
            ticks,
            (this.maxValue - this.rightValue) / this.tickResolution,
            true
        );
        // console.log('ticks: ', ticks);

        return ticks;
    }

    /**
     * @protected
     */
    configure() {
        super.configure();

        // Called on chart update / panFunctions end
        this._valueRange = this.maxValue - this.minValue;
        this.rightValue = this.options.rightValue;
        this.pxPerUnit = this.getPxPerUnit();
    }

    getPxPerUnit() {
        const u1 = this.ticks[this.ticks.length - 1].value;
        const u2 = this.ticks[this.ticks.length - 2].value;
        const diff = Math.abs(u1 - u2);

        return (this.getPixelForValue(u1) - this.getPixelForValue(u2)) / diff;
    }

    getPixelForValue(value) {
        if (value === undefined || value === 0) {
            value = this.min;
        }

        const startValue = this.maxValue - this.rightValue;
        const offset =
            this.rightValue === this.maxValue
                ? 0
                : value <= this.rightValue
                ? -startValue
                : this.rightValue - this.minValue;
        const negOffset = this.minValue < 0 ? -this.minValue : 0;
        const decimal = (value - offset + negOffset) / this._valueRange;

        return this.getPixelForDecimal(decimal);
    }

    getValueForPixel(pixel) {
        const decimal = this.getDecimalForPixel(pixel);

        const startValue = this.maxValue - this.rightValue;
        const negOffset = this.minValue < 0 ? -this.minValue : 0;
        const zeroPixel = this.getPixelForDecimal(startValue);
        const offset =
            zeroPixel < pixel ? this.rightValue - this.minValue : -startValue;

        return offset - negOffset + decimal * this._valueRange;
    }

    arrayRotate(arr, times, reverse) {
        for (let i = 0; i < times; i++) {
            if (reverse) arr.unshift(arr.pop());
            else arr.push(arr.shift());
        }
        return arr;
    }
}

cyclicAxisPlugin.id = 'cyclicAxis';
cyclicAxisPlugin.defaults = {};

module.exports = cyclicAxisPlugin;