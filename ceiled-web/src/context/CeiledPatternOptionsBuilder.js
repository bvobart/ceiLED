export class CeiledPatternOptionsBuilder {
  speed;
  channels;
  colors2;
  colors3;
  jumpType;
  fadeType;

  optionsType;

  constructor() {
    this.optionsType = 'solid';
  }

  for(pattern) {
    this.optionsType = pattern;
    return this;
  }

  setSpeed(speed) {
    this.speed = speed;
    return this;
  }

  setChannels(numChannels) {
    this.channels = numChannels;
    return this;
  }

  setSecondaryColors(colors2) {
    this.colors2 = colors2;
    return this;
  }
  
  setTernaryColors(colors3) {
    this.colors3 = colors3;
    return this;
  }

  setJumpType(jumpType) {
    this.jumpType = jumpType;
    return this;
  }

  setFadeType(fadeType) {
    this.fadeType = fadeType;
    return this;
  }

  build() {
    let channelsUsed = this.colors2 ? 2 : 1;
    channelsUsed = this.colors3 ? 3 : channelsUsed;
    switch (this.optionsType) {
      case 'solid': return {};
      case 'fade': return {
        speed: this.speed,
        channels: this.channels ? this.channels : channelsUsed,
        colors2: this.colors2,
        colors3: this.colors3,
        fadeType: this.fadeType ? this.fadeType : 'normal'
      };
      case 'jump': return {
        speed: this.speed,
        channels: this.channels ? this.channels : channelsUsed,
        colors2: this.colors2,
        colors3: this.colors3,
        jumpType: this.jumpType ? this.jumpType : 'normal'
      };
      default: return {};
    }
  }
}

export default CeiledPatternOptionsBuilder;