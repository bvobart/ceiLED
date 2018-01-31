import Pattern from './Pattern';

/**
 * @typedef {Object} Colour
 * @property {Number} red red value
 * @property {Number} green green value
 * @property {Number} blue blue value
 */

class SingleSolidPattern extends Pattern {
    /**
     * @typedef {Object} SingleSolidPatternOptions
     * @property {Colour} colour The single colour.
     */
    constructor() {
        super(1, 'solid', 100, 0);
    }

    /**
     * Displays as a solid colour on all channels.
     * Brightness and speed are not used.
     * @param {SingleSolidPatternOptions} options Options.
     */
    show(options) {
        this.verifyOptions(options);
        //TODO: insert PiGPIO code to show pattern.
    }

    /**
     * Verifies the options given for this pattern. Throws an error if options are invalid.
     * @param {SingleSolidPatternOptions} options Options.
     */
    verifyOptions(options) {
        if (options 
            && options.colour
            && options.colour.red 
            && options.colour.green 
            && options.colour.blue) {
            return;
        } else {
            throw new Error("Invalid options: ", options);
        }
    }
}

class TripleSolidPattern extends Pattern {
    /**
     * @typedef {Object} TripleSolidPatternOptions
     * @property {Colour} colour1 Colour for channel 1
     * @property {Colour} colour2 Colour for channel 2
     * @property {Colour} colour3 Colour for channel 3
     */
    constructor() {
        super(3, 'solid', 100, 0);
    }

    /**
     * Displays as three solid colours, one for each channel.
     * @param {TripleSolidPatternOptions} options Options.
     */
    show(options) {
        this.verifyOptions(options);
        //TODO: insert PiGPIO code to show pattern.
    }

    /**
     * Verifies the options given for this pattern. Throws an error if options are invalid.
     * @param {TripleSolidPatternOptions} options Options.
     */
    verifyOptions(options) {
        if (options 
            && options.colour1
            && options.colour1.red 
            && options.colour1.green 
            && options.colour1.blue
            && options.colour2
            && options.colour2.red 
            && options.colour2.green 
            && options.colour2.blue
            && options.colour3
            && options.colour3.red 
            && options.colour3.green 
            && options.colour3.blue) {
            return;
        } else {
            throw new Error("Invalid options: ", options);
        }
    }
}

export default { SingleSolidPattern, TripleSolidPattern };