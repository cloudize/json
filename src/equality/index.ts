const deepEqual = require('deep-equal');

// eslint-disable-next-line import/prefer-default-export
export function areEqual(firstObject: any, secondObject: any): boolean {
  return deepEqual(firstObject, secondObject);
}
