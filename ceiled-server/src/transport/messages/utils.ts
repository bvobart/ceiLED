type Constructor<T> = new (...args: any[]) => T;

type PrimitiveOrConstructor<T> = Constructor<T> | 'string' | 'number' | 'boolean';

function isType<T>(obj: any, className: PrimitiveOrConstructor<T>): obj is T {
  if (typeof className === 'string') {
    return typeof obj === className;
  }
  return obj instanceof className;
}
