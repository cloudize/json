const deepEqual = require('deep-equal');
const clonedeep = require('lodash.clonedeep');

export function isArray(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && (typeof value === 'object') && (value.constructor === Array);
}

export function isBoolean(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && (typeof value === 'boolean');
}

export function isDate(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && (value instanceof Date);
}

export function isEmpty(document: any): boolean {
  return (!document) || (Object.keys(document).length === 0 && document.constructor === Object);
}

export function isError(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && (value instanceof Error) && (typeof value.message !== 'undefined');
}

export function isNumber(value: any): boolean {
  // eslint-disable-next-line no-restricted-globals
  return ((value !== null) && ((value !== undefined))) && (typeof value === 'number') && isFinite(value);
}

export function isObject(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && (typeof value === 'object') && (value.constructor === Object);
}

export function isRegExp(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && (typeof value === 'object') && (value.constructor === RegExp);
}

export function isString(value: any): boolean {
  return ((value !== null) && ((value !== undefined))) && ((typeof value === 'string') || (value instanceof String));
}

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
    for (const key in (document as object)) {
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

export function stringify(obj: any, indent: number = 4, linePrefix: string = '',
  quoteFieldNames: boolean = true): string {
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
