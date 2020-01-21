/**
 * Creates an array containing all elements from 0 up to (but not including) `n`
 * @param n the capacity of the resulting array.
 */
export const range = (n: number): number[] => Array.from({ length: n }, (_, key) => key);

/**
 * Ensures that a certain number value is within a certain range.
 * @param value the value
 * @param min minimum of the range
 * @param max maximum of the range.
 */
export const inRange = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};
