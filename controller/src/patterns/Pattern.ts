interface Pattern {
  /**
   * Displays the pattern on the actual LED strips. Should never block.
   */
  show(): void;

  /**
   * Stops displaying the pattern. Should never block.
   */
  stop(): void;
}

export default Pattern;