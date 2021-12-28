const deepEqual = require('deep-equal');
const clonedeep = require('lodash.clonedeep');

export function isDefined(value: any): boolean {
  return (value !== undefined);
}

export function isDefinedAndNotNull(value: any): boolean {
  return (value !== undefined) && (value !== null);
}

export function isUndefined(value: any): boolean {
  return (value === undefined);
}

export function isUndefinedOrNull(value: any): boolean {
  return (value === undefined) || (value === null);
}

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

export function isFalse(value: any): boolean {
  return isBoolean(value) && (value === false);
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

export function isEmpty(document: any): boolean {
  return (isUndefined(document)) || (isObject(document) && (Object.keys(document).length === 0));
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

export function isTrue(value: any): boolean {
  return isBoolean(value) && (value === true);
}

export function hasProperty(obj: any, property: string): boolean {
  return isDefined(obj) && isObject(obj) && Object.prototype.hasOwnProperty.call(obj, property);
}

export function append(document: any, extensionDocument: any): any {
  const doc: any = document || {};
  const extensionDoc: any = extensionDocument || {};

  const sourceKeys: string[] = Object.keys(extensionDoc);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < sourceKeys.length; i++) {
    if (isArray(extensionDoc[sourceKeys[i]])) {
      if (Object.prototype.hasOwnProperty.call(doc, sourceKeys[i])) {
        const sourceSet = new Set(doc[sourceKeys[i]]);
        const extensionSet = new Set(extensionDoc[sourceKeys[i]]);
        const mergedSet = new Set([...Array.from(sourceSet), ...Array.from(extensionSet)]);

        doc[sourceKeys[i]] = [...Array.from(mergedSet)];
      } else {
        doc[sourceKeys[i]] = extensionDoc[sourceKeys[i]];
      }
    } else if (isObject(extensionDoc[sourceKeys[i]])) {
      if (Object.prototype.hasOwnProperty.call(doc, sourceKeys[i])) {
        append(doc[sourceKeys[i]], extensionDoc[sourceKeys[i]]);
      } else {
        doc[sourceKeys[i]] = extensionDoc[sourceKeys[i]];
      }
    } else {
      doc[sourceKeys[i]] = extensionDoc[sourceKeys[i]];
    }
  }

  return doc;
}

export function areEqual(firstObject: any, secondObject: any): boolean {
  return deepEqual(firstObject, secondObject);
}

export function redactUndefinedValues(document: any) {
  if (isArray(document)) {
    // eslint-disable-next-line no-plusplus
    for (let index = document.length - 1; index >= 0; index--) {
      if (isDefined(document[index])) {
        redactUndefinedValues(document[index]);
      } else {
        // eslint-disable-next-line no-param-reassign
        document = document.splice(index, 1);
      }
    }
  } else if (isObject(document)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in document) {
      if (Object.prototype.hasOwnProperty.call(document, key)) {
        if (isDefined(document[key])) {
          redactUndefinedValues(document[key]);
        } else {
          // eslint-disable-next-line no-param-reassign
          delete document[key];
        }
      }
    }
  }
}

export function clone(value: any, shouldRedactUndefinedValues: boolean = true): any {
  if (value) {
    const clonedDocument: any = clonedeep(value);

    if (shouldRedactUndefinedValues) {
      redactUndefinedValues(clonedDocument);
    }

    return clonedDocument;
  }

  return undefined;
}

export function stringify(
  obj: any,
  indent: number = 4,
  linePrefix: string = '',
  quoteFieldNames: boolean = true,
): string {
  const lines = JSON.stringify(obj, null, indent).split('\n');

  if (linePrefix !== '') {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < lines.length; i++) {
      lines[i] = linePrefix + lines[i];
    }
  }

  if (!quoteFieldNames) {
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < lines.length - 1; i++) {
      if ((lines[i].match(/:/g) || []).length > 0) {
        const valuePair = lines[i].split(':');
        valuePair[0] = valuePair[0].replace(/"/g, '');
        lines[i] = valuePair.join(':');
      }
    }
  }

  return lines.join('\n');
}

export function extractAndRedact(document: any, propertyName: string): any {
  if (Object.prototype.hasOwnProperty.call(document, propertyName)) {
    const value: any = clone(document[propertyName]);

    // eslint-disable-next-line no-param-reassign
    delete document[propertyName];

    return value;
  }

  return undefined;
}
