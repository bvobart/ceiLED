export default class CeiledError {
  public message: string;
  public stackTrace: string;

  constructor(error: Error) {
    this.message = error.message;
    this.stackTrace = error.stack;
  }
}
