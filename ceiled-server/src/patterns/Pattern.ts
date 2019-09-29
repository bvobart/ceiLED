import { Driver } from '../hardware/Driver';

interface Pattern {
  /**
   * Displays the pattern on the specified driver. Should never block.
   */
  show(driver: Driver): Promise<void>;

  /**
   * Stops displaying the pattern. Should never block.
   */
  stop(): void;
}

export default Pattern;
