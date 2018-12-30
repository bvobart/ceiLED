export class CeiledRequestBuilder {
  type;
  colors;
  patternOptions;

  authToken;

  constructor() {
    this.colors = [];
    this.patternOptions = {}
  }

  setAuthToken(token) {
    this.authToken = token;
    return this;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setColors(colors) {
    this.colors = colors;
    return this;
  }

  setPatternOptions(options) {
    this.patternOptions = options;
    return this;
  }

  build() {
    return {
      data: {
        type: this.type,
        colors: this.colors,
        patternOptions: this.patternOptions,
      },
      authToken: this.authToken
    }
  }
}

export default CeiledRequestBuilder;
