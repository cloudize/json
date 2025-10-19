import { redactUndefinedValues } from '../object';

const clonedeep = require('lodash.clonedeep');

// eslint-disable-next-line import/prefer-default-export
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

export function extractAndRedact(document: any, propertyName: string): any {
  if (Object.prototype.hasOwnProperty.call(document, propertyName)) {
    const value: any = clone(document[propertyName]);

    // eslint-disable-next-line no-param-reassign
    delete document[propertyName];

    return value;
  }

  return undefined;
}
