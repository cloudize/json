import { isDefinedAndNotNull } from '../common';

export function isArray(value: any): value is Array<any> {
  return isDefinedAndNotNull(value) && (typeof value === 'object')
    && (value.constructor === Array);
}

export function isBoolean(value: any): value is boolean {
  return isDefinedAndNotNull(value) && (typeof value === 'boolean');
}

export function isDate(value: any): value is Date {
  return isDefinedAndNotNull(value) && (value instanceof Date);
}

export function isError(value: any): value is Error {
  return isDefinedAndNotNull(value) && (value instanceof Error) && (typeof value.message !== 'undefined');
}

export function isNumber(value: any): value is number {
  // eslint-disable-next-line no-restricted-globals
  return isDefinedAndNotNull(value) && (typeof value === 'number') && isFinite(value);
}

export function isInteger(value: any): value is number {
  return isNumber(value) && (value % 1 === 0);
}

export function isObject(value: any): value is Object {
  return isDefinedAndNotNull(value) && (typeof value === 'object')
    && ((value.constructor === Object) || ((value instanceof Object) && (!isArray(value))));
}

export function isRegExp(value: any): value is RegExp {
  return isDefinedAndNotNull(value) && (typeof value === 'object') && (value.constructor === RegExp);
}

export function isString(value: any): value is string {
  return isDefinedAndNotNull(value) && ((typeof value === 'string') || (value instanceof String));
}

export function isArrayOfBooleans(values: any): values is boolean[] {
  if (isArray(values)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) if (!isBoolean(value)) return false;

    return true;
  }

  return false;
}

export function isArrayOfDates(values: any): values is Date[] {
  if (isArray(values)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) if (!isDate(value)) return false;

    return true;
  }

  return false;
}

export function isArrayOfIntegers(values: any): values is number[] {
  if (isArray(values)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) if (!isInteger(value)) return false;

    return true;
  }

  return false;
}

export function isArrayOfNumbers(values: any): values is number[] {
  if (isArray(values)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) if (!isNumber(value)) return false;

    return true;
  }

  return false;
}

export function isArrayOfStrings(values: any): values is string[] {
  if (isArray(values)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) if (!isString(value)) return false;

    return true;
  }

  return false;
}

export function isArrayOfObjects(values: any): values is object[] {
  if (isArray(values)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) if (!isObject(value)) return false;

    return true;
  }

  return false;
}
