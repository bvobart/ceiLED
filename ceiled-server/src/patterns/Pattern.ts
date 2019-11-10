import { Driver } from '../hardware/Driver';

interface Pattern {
  // discriminator by which the pattern's implementation can be recognised at runtime
  variant: string;

  /**
   * Displays the pattern on the specified driver. Should never block.
   */
  show(channel: number | 'all', driver: Driver): Promise<void>;

  /**
   * Stops displaying the pattern. Should never block.
   */
  stop(): void;
}

export default Pattern;
