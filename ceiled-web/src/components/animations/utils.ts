/**
 * Creates an array containing all elements from 0 up to (but not including) `n`
 * @param n the capacity of the resulting array.
 */
export const range = (n: number): number[] => Array.from({ length: n }, (_, key) => key);

/**
 * Removes the element at the `source` index and inserts it at the `destination` index.
 * Returns a new list.
 * @param list the source list
 * @param source the index of the first element
 * @param destination the index of the second element
 */
export const reorder = <T>(list: Array<T>, source: number, destination: number): Array<T> => {
  const result = [...list];
  const [removed] = result.splice(source, 1);
  result.splice(destination, 0, removed);
  return result;
}

/**
 * Replaces the item at position `index` in the given list with `newValue`. Returns a new list.
 * @param list the source list
 * @param index the index of the element to be replaced
 * @param newValue the new value that will be put at the given index.
 */
export const replace = <T>(list: Array<T>, index: number, newValue: T): Array<T> => {
  const result = [...list];
  result[index] = newValue;
  return result;
}

/**
 * Removes an item from an array, returning an array with as first element a new array containing
 * the result of this operation and as second value the removed element.
 * @param list the source list
 * @param index index of the element to be removed
 */
export const remove = <T>(list: Array<T>, index: number): [Array<T>, T] => {
  const result = [...list];
  const [removed] = result.splice(index, 1);
  return [result, removed];
}

/**
 * Inserts an item in a list at the specified index. Returns a new array.
 * @param list the source list
 * @param index the index at which to insert the element
 * @param value the element to be inserted
 */
export const insert = <T>(list: Array<T>, index: number, value: T): Array<T> => {
  const result = [...list];
  result.splice(index, 0, value);
  return result;
}
