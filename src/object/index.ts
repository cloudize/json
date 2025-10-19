import { isDefined, isUndefined } from '../common';
import { isArray, isObject } from '../type-guards';

export function isEmpty(document: any): boolean {
  return (isUndefined(document)) || (isObject(document) && (Object.keys(document).length === 0));
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
