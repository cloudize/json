import { isUndefined } from '../common';
import { isBoolean } from '../type-guards';

export function isFalse(value: any): boolean {
  return isBoolean(value) && (value === false);
}

export function isFalseOrUndefined(value: any): boolean {
  return isUndefined(value) || (isBoolean(value) && (value === false));
}

export function isTrue(value: any): boolean {
  return isBoolean(value) && (value === true);
}
