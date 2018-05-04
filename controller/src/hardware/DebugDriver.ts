/**
 * Mock driver purely for debugging purposes. Is used when no other driver can be used.
 */
class DebugDriver {
  public setDutyCycle(pinNr: number, dutyCycle: number) {
    console.log("[DEBUG] Set pin", pinNr, "to", dutyCycle);
  }
}

export default DebugDriver;
