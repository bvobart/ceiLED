class Pattern {
    /**
     * Constructs a custom pattern.
     * @param {Number} channels Number of channels. 1 means all LED strips get the same colours,
     *                          3 means individual colours for each channel.
     * @param {String} type Type of pattern. Might become a code to identify the pattern.
     * @param {Number} brightness Maximum brightness of the pattern. May not always be used.
     * @param {Number} speed Pattern-specific speed of the pattern. May not always be used,
     *                       and its exact meaning may differ per pattern.
     */
    constructor(channels, type, brightness, speed) {
        this.channels = channels;
        this.type = type;
        this.brightness = brightness;
        this.speed = speed;
    }

    /**
     * Sets the brightness on this pattern.
     * @param {Number} brightness new brightness
     */
    setBrightness(brightness) {
        this.brightness = brightness;
    }

    /**
     * Sets the speed on this pattern.
     * @param {Number} speed new speed
     */
    setSpeed(speed) {
        this.speed = speed;
    }

    /**
     * Displays the pattern on the actual LED strips. This method should be overridden
     * by subclasses. Calling this superclass method throws an error.
     * @param {Object} options Pattern-specific options object.
     */
    show(options) {
        throw new Error("Superclass method show() not implemented.");
    }
}

export default Pattern;
