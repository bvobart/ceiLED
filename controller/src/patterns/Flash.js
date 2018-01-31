import Pattern from './Pattern';
import { SingleSolidPattern } from './Solid';

/**
 * @typedef {Object} Colour
 * @property {Number} red red value
 * @property {Number} green green value
 * @property {Number} blue blue value
 */

class SingleChannelFlash extends Pattern {
    /**
     * @typedef {Object} SingleChannelFlashOptions
     * @property {Colour} colour Colour to flash. Defaults to white if this is undefined.
     */

    /**
     * Initialises a SingleChannelFlash
     * @param {Number} brightness Maximum brightness.
     * @param {Number} speed The length of a flash in milliseconds, which is equal to the interval
     * between each flash.
     */
    constructor(brightness, speed) {
        super(1, 'flash', brightness, speed);
    }

    /**
     * Displays as a flash of a single colour.
     * @param {SingleChannelFlashOptions} options Options.
     */
    show(options) {
        if (!options || !options.colour) options = { colour: { red: 255, green: 255, blue: 255 } };
        new SingleSolidPattern().show(options);
        setTimeout(() => {
            const black = { colour: { red: 0, green: 0, blue: 0 } };
            new SingleSolidPattern().show(black);
        }, speed);
    }
}