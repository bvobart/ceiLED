import Pattern from './Pattern';

/**
 * @typedef {Object} Colour
 * @property {Number} red red value
 * @property {Number} green green value
 * @property {Number} blue blue value
 */

class SingleChannelFade extends Pattern {
    /**
     * @typedef {Object} SingleChannelFadeOptions
     * @property {Colour[]} colours An array of colours to fade over.
     */

    /**
     * Initialises a SingleChannelFade
     * @param {Number} brightness Maximum brightness.
     * @param {Number} speed The time it should take for one colour to fully fade over to the other.
     */
    constructor(brightness, speed) {
        super(1, 'fade', brightness, speed);
    }

    /**
     * Displays on a single channel as a crossfade between two or more colours.
     * @param {SingleChannelFadeOptions} options Options.
     */
    show(options) {
        this.verifyOptions(options);
        //TODO: Actually implement single channel fade.
    }

    /**
     * Verifies the options given for this pattern. Throws an error if options are invalid.
     * @param {TripleChannelFadeOptions} options Options.
     */
    verifyOptions(options) {
        if (options && options.colours && options.colours.length > 1) {
            return;
        } else {
            throw new Error("Invalid options: ", options);
        }
    }
}

class TripleChannelFade extends Pattern {
    /**
     * @typedef {Object} TripleChannelFadeOptions
     * @property {Colour[]} colours1 An array of colours for channel 1 to fade over.
     * @property {Colour[]} colours2 An array of colours for channel 2 to fade over.
     * @property {Colour[]} colours3 An array of colours for channel 3 to fade over.
     */

     /**
     * Initialises a TripleChannelFade
     * @param {Number} brightness Maximum brightness.
     * @param {Number} speed The time it should take for one colour to fully fade over to the other.
     */
    constructor(brightness, speed) {
        super(3, 'fade', brightness, speed);
    }

    /**
     * Displays as three fades on the three different channels, each with their own set of colours.
     * @param {TripleChannelFadeOptions} options Options.
     */
    show(options) {
        this.verifyOptions(options);
        //TODO: Actually implement this pattern.
    }

    /**
     * Verifies the options given for this pattern. Throws an error if options are invalid.
     * @param {TripleChannelFadeOptions} options Options.
     */
    verifyOptions(options) {
        if (options && options.colours1 && options.colours2 && options.colours3) {
            return;
        } else {
            throw new Error("Invalid options: ", options);
        }
    }
}

export default { SingleChannelFade, TripleChannelFade };