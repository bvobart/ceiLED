declare module 'duration' {
  class Duration {
    constructor(from: Date, to: Date);
    valueOf(): number;
  }
  export = Duration;
}
