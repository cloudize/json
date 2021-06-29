import {
  append,
  areEqual,
  clone,
  extractAndRedact,
  hasProperty,
  isArray,
  isBoolean,
  isDate,
  isDefined,
  isEmpty,
  isError,
  isDefinedAndNotNull,
  isFalse,
  isNumber,
  isObject,
  isRegExp,
  isString,
  isTrue,
  isUndefined,
  isUndefinedOrNull,
  stringify,
} from '../../src';

describe('The JSON Utils', () => {
  describe('append() method', () => {
    it('should return an object containing the extension if the document is undefined', () => {
      expect(append(undefined, { a: 1 })).toEqual({ a: 1 });
    });

    it('should return the original value if the extension is undefined', () => {
      expect(append({}, undefined)).toEqual({});
    });

    it('should return an extended object if both the original value and the extension are defined', () => {
      expect(append({ a: 1 }, { b: 'Hello' })).toEqual({ a: 1, b: 'Hello' });
    });

    it('should return an extended object with a value being overriden if both the original value and the extension are '
      + 'defined and they have a common element', () => {
      expect(append({ a: 1, b: 1 }, { b: 2, c: 'Hello' })).toEqual({ a: 1, b: 2, c: 'Hello' });
    });

    it('should return an extended object with complex document and extension documents', () => {
      const document = {
        a: 1,
        b: {
          firstField: 'value',
          secondField: 'value',
          thirdField: 'value',
        },
        c: {
          firstElement: {
            firstField: 'value',
            secondField: 'value',
            thirdField: 'value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
            ],
          },
          secondElement: {
            firstField: 'value',
            secondField: 'value',
            thirdField: 'value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
            ],
          },
          thirdElement: {
            firstField: 'value',
            secondField: 'value',
            thirdField: 'value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
            ],
          },
          fouthElement: [
            {
              name: 'first',
              children: [
                { name: 'first' },
              ],
            },
            {
              name: 'second',
              children: [
                { name: 'first' },
                { name: 'second' },
              ],
            },
          ],
        },
      };
      const extensionDocument = {
        a: 2,
        b: {
          firstField: 'new value',
          fourthValue: 'new value',
          array: [
            'first Array Item',
            'second Array Item',
            'third Array Item',
          ],
        },
        c: {
          firstElement: {
            firstField: 'new value',
            fourthValue: 'new value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
            ],
            embeddedObject: {
              north: true,
              south: false,
            },
          },
          secondElement: {
            secondField: 'new value',
            fourthValue: 'new value',
            array: [
              'first Array Item',
              'second Array Item',
              'fourth Array Item',
            ],
          },
          thirdElement: {
            thirdField: 'new value',
            fourthValue: 'new value',
            array: [
              'fourth Array Item',
              'fifth Array Item',
            ],
          },
          fouthElement: [
            {
              name: 'third',
              children: [
                { name: 'first' },
                { name: 'second' },
                { name: 'third' },
              ],
            },
          ],
        },
        d: 'new value',
      };
      const expectedResult = {
        a: 2,
        b: {
          firstField: 'new value',
          secondField: 'value',
          thirdField: 'value',
          fourthValue: 'new value',
          array: [
            'first Array Item',
            'second Array Item',
            'third Array Item',
          ],
        },
        c: {
          firstElement: {
            firstField: 'new value',
            secondField: 'value',
            thirdField: 'value',
            fourthValue: 'new value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
            ],
            embeddedObject: {
              north: true,
              south: false,
            },
          },
          secondElement: {
            firstField: 'value',
            secondField: 'new value',
            thirdField: 'value',
            fourthValue: 'new value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
              'fourth Array Item',
            ],
          },
          thirdElement: {
            firstField: 'value',
            secondField: 'value',
            thirdField: 'new value',
            fourthValue: 'new value',
            array: [
              'first Array Item',
              'second Array Item',
              'third Array Item',
              'fourth Array Item',
              'fifth Array Item',
            ],
          },
          fouthElement: [
            {
              name: 'first',
              children: [
                { name: 'first' },
              ],
            },
            {
              name: 'second',
              children: [
                { name: 'first' },
                { name: 'second' },
              ],
            },
            {
              name: 'third',
              children: [
                { name: 'first' },
                { name: 'second' },
                { name: 'third' },
              ],
            },
          ],
        },
        d: 'new value',
      };

      expect(append(document, extensionDocument)).toEqual(expectedResult);
    });
  });

  describe('areEqual() method', () => {
    it('should return true for two undefined inputs', () => {
      expect(areEqual(undefined, undefined)).toBe(true);
    });

    it('should return false if one input is undefined and one is an empty object', () => {
      expect(areEqual({ }, undefined)).toBe(false);
    });

    it('should return false if the two inputs have the same elements, but not the same values', () => {
      expect(areEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should return false if the two inputs have different elements, but the same values', () => {
      expect(areEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it('should return true if the two simple documents that are equal', () => {
      expect(areEqual({ a: 1 }, { a: 1 })).toBe(true);
    });

    it('should return true if the two simple documents including dates', () => {
      const testdate = new Date();
      expect(areEqual({ a: 1, date: testdate }, { a: 1, date: testdate })).toBe(true);
    });

    it('should return true if the two complex documents that are equal but where the elements are not in the '
      + 'same order', () => {
      expect(areEqual(
        {
          a: 1,
          b: { b1: true },
          c: ['value1', 'value2'],
        },
        {
          a: 1,
          c: ['value1', 'value2'],
          b: { b1: true },
        },
      )).toBe(true);
    });
  });

  describe('clone() method', () => {
    it('should return an undefined output for an undefined input', () => {
      const outputDocument = clone(undefined);
      expect(outputDocument).toBeUndefined();
    });

    it('should return an empty output for an empty input', () => {
      const outputDocument = clone({});
      expect(outputDocument).toEqual({});
    });

    it('should return an output document that equals the input document', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const outputDocument = clone(document);
      expect(outputDocument).not.toBe(document);
      expect(outputDocument).toEqual(document);
    });

    it('should return an output document that excludes undefined fields in the input document', () => {
      const document: any = {
        name: 'value',
        count: 1,
        valid: true,
        something: undefined,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
          something: undefined,
        },
        options: [
          undefined,
          { },
          { something: undefined },
        ],
      };

      const outputDocument = clone(document);

      const expected = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [{}, {}],
      };

      expect(outputDocument).not.toBe(document);
      expect(outputDocument).toEqual(expected);
    });
  });

  describe('extractAndRedact() method', () => {
    it('should return undefined if the element does not exist', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const gender = extractAndRedact(document, 'gender');
      expect(gender).toBeUndefined();
    });

    it('should return a string element from the document and redact it', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const name = extractAndRedact(document, 'name');
      expect(name).toBeDefined();
      expect(name).toBe('value');
      expect(Object.prototype.hasOwnProperty.call(document, 'name')).toBe(false);
    });

    it('should return a number element from the document and redact it', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const count = extractAndRedact(document, 'count');
      expect(count).toBeDefined();
      expect(count).toBe(1);
      expect(Object.prototype.hasOwnProperty.call(document, 'count')).toBe(false);
    });

    it('should return a boolean element from the document and redact it', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const valid = extractAndRedact(document, 'valid');
      expect(valid).toBeDefined();
      expect(valid).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(document, 'valid')).toBe(false);
    });

    it('should return an object element from the document and redact it', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const address = extractAndRedact(document, 'address');
      expect(address).toBeDefined();
      expect(address).toEqual({ line1: 'line1 value', line2: 'line2 value' });
      expect(Object.prototype.hasOwnProperty.call(document, 'address')).toBe(false);
    });

    it('should return an array element from the document and redact it', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const options = extractAndRedact(document, 'options');
      expect(options).toBeDefined();
      expect(options).toEqual(['email', 'print']);
      expect(Object.prototype.hasOwnProperty.call(document, 'options')).toBe(false);
    });
  });

  describe('hasProperty() method', () => {
    it('should return false for an undefined object', () => {
      const result = hasProperty(undefined, 'property');
      expect(result).toBe(false);
    });

    it('should return false for an invalid object', () => {
      const result = hasProperty(5, 'property');
      expect(result).toBe(false);
    });

    it('should return false for an array', () => {
      const result = hasProperty([], 'property');
      expect(result).toBe(false);
    });

    it('should return false for an object without the property', () => {
      const result = hasProperty({}, 'property');
      expect(result).toBe(false);
    });

    it('should return true for an object with the property', () => {
      const result = hasProperty({ property: 1 }, 'property');
      expect(result).toBe(true);
    });
  });

  describe('isArray() method', () => {
    it('should return true for an empty array', () => {
      const result = isArray([]);
      expect(result).toBe(true);
    });

    it('should return true for an array with simple items', () => {
      const result = isArray(['Bob', 'Frank', 'Sue']);
      expect(result).toBe(true);
    });

    it('should return true for an array with object items', () => {
      const result = isArray([{ name: 'Bob' }, { name: 'Frank' }, { name: 'Sue' }]);
      expect(result).toBe(true);
    });

    it('should return false for an undefined document', () => {
      const result = isArray(undefined);
      expect(result).toBe(false);
    });

    it('should return false for an empty object', () => {
      const result = isArray({});
      expect(result).toBe(false);
    });

    it('should return false for a document with a string element', () => {
      const result = isArray({ name: 'value' });
      expect(result).toBe(false);
    });
  });

  describe('isBoolean() method', () => {
    it('should return true for a boolean field', () => {
      expect(isBoolean(true)).toBe(true);
    });

    it('should return false for an array field', () => {
      expect(isBoolean([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isBoolean(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isBoolean(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(isBoolean(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isBoolean({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isBoolean('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(isBoolean(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isDate() method', () => {
    it('should return false for a boolean field', () => {
      expect(isDate(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(isDate([])).toBe(false);
    });

    it('should return true for an date field', () => {
      expect(isDate(new Date())).toBe(true);
    });

    it('should return false for an error object', () => {
      expect(isDate(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(isDate(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isDate({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isDate('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(isDate(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isDefined() method', () => {
    it('should return true for a boolean value', () => {
      expect(isDefined(true)).toBe(true);
    });

    it('should return true for an array value', () => {
      expect(isDefined([])).toBe(true);
    });

    it('should return true for a date value', () => {
      expect(isDefined(new Date())).toBe(true);
    });

    it('should return true for an error object', () => {
      expect(isDefined(new Error('Test'))).toBe(true);
    });

    it('should return true for a number value', () => {
      expect(isDefined(5)).toBe(true);
    });

    it('should return true for an Object value', () => {
      expect(isDefined({})).toBe(true);
    });

    it('should return true for a string value', () => {
      expect(isDefined('true')).toBe(true);
    });

    it('should return true for a Regex value', () => {
      expect(isDefined(new RegExp('test', 'g'))).toBe(true);
    });

    it('should return true for a null value', () => {
      expect(isDefined(null)).toBe(true);
    });

    it('should return false for an undefined value', () => {
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isDefinedAndNotNull() method', () => {
    it('should return true for a boolean value', () => {
      expect(isDefinedAndNotNull(true)).toBe(true);
    });

    it('should return true for an array value', () => {
      expect(isDefinedAndNotNull([])).toBe(true);
    });

    it('should return true for a date value', () => {
      expect(isDefinedAndNotNull(new Date())).toBe(true);
    });

    it('should return true for an error object', () => {
      expect(isDefinedAndNotNull(new Error('Test'))).toBe(true);
    });

    it('should return true for a number value', () => {
      expect(isDefinedAndNotNull(5)).toBe(true);
    });

    it('should return true for an Object value', () => {
      expect(isDefinedAndNotNull({})).toBe(true);
    });

    it('should return true for a string value', () => {
      expect(isDefinedAndNotNull('test')).toBe(true);
    });

    it('should return true for a Regex value', () => {
      expect(isDefinedAndNotNull(new RegExp('test', 'g'))).toBe(true);
    });

    it('should return false for a null value', () => {
      expect(isDefinedAndNotNull(null)).toBe(false);
    });

    it('should return true for an undefined value', () => {
      expect(isDefinedAndNotNull(undefined)).toBe(false);
    });
  });

  describe('isEmpty() method', () => {
    it('should return true for an undefined document', () => {
      const result = isEmpty(undefined);
      expect(result).toBe(true);
    });

    it('should return true for an empty document', () => {
      const result = isEmpty({});
      expect(result).toBe(true);
    });

    it('should return false for a document with a string element', () => {
      const result = isEmpty({ name: 'value' });
      expect(result).toBe(false);
    });

    it('should return false for a document containing a sub document', () => {
      const result = isEmpty({ name: { value: 1 } });
      expect(result).toBe(false);
    });

    it('should return false for a document containing an array', () => {
      const result = isEmpty({ names: ['value'] });
      expect(result).toBe(false);
    });
  });

  describe('isError() method', () => {
    it('should return false for a boolean field', () => {
      expect(isError(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(isError([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isError(new Date())).toBe(false);
    });

    it('should return true for an error object', () => {
      expect(isError(new Error('Test'))).toBe(true);
    });

    it('should return false for an number field', () => {
      expect(isError(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isError({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isError('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(isError(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isFalse() method', () => {
    it('should return false for an undefined value', () => {
      expect(isFalse(undefined)).toBe(false);
    });

    it('should return false for a null value', () => {
      expect(isFalse(null)).toBe(false);
    });

    it('should return false for a true (boolean) field', () => {
      expect(isFalse(true)).toBe(false);
    });

    it('should return true for a false (boolean) field', () => {
      expect(isFalse(false)).toBe(true);
    });

    it('should return false for an array field', () => {
      expect(isFalse([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isFalse(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isFalse(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(isFalse(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isFalse({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isFalse('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(isFalse(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isNumber() method', () => {
    it('should return false for a boolean field', () => {
      expect(isNumber(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(isNumber([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isNumber(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isNumber(new Error('Test'))).toBe(false);
    });

    it('should return true for an number field', () => {
      expect(isNumber(5)).toBe(true);
    });

    it('should return false for an Object field', () => {
      expect(isNumber({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isNumber('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(isNumber(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isObject() method', () => {
    it('should return true for an empty object', () => {
      const result = isObject({});
      expect(result).toBe(true);
    });

    it('should return true for an object with values', () => {
      const result = isObject({ name: 'Bob' });
      expect(result).toBe(true);
    });

    it('should return true for a Date object', () => {
      const result = isObject(new Date());
      expect(result).toBe(true);
    });

    it('should return false for an undefined document', () => {
      const result = isObject(undefined);
      expect(result).toBe(false);
    });

    it('should return false for a string', () => {
      const result = isObject('Bob');
      expect(result).toBe(false);
    });

    it('should return false for a number', () => {
      const result = isObject(7);
      expect(result).toBe(false);
    });

    it('should return false for an array', () => {
      const result = isObject([]);
      expect(result).toBe(false);
    });
  });

  describe('isRegExp() method', () => {
    it('should return false for a boolean field', () => {
      expect(isRegExp(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(isRegExp([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isRegExp(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isRegExp(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(isRegExp(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isRegExp({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isRegExp('test')).toBe(false);
    });

    it('should return true for an Regex field', () => {
      expect(isRegExp(new RegExp('test', 'g'))).toBe(true);
    });
  });

  describe('isString() method', () => {
    it('should return false for a boolean field', () => {
      expect(isString(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(isString([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isString(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isString(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(isString(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isString({})).toBe(false);
    });

    it('should return true for an string field', () => {
      expect(isString('test')).toBe(true);
    });

    it('should return false for an Regex field', () => {
      expect(isString(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isTrue() method', () => {
    it('should return false for an undefined value', () => {
      expect(isTrue(undefined)).toBe(false);
    });

    it('should return false for a null value', () => {
      expect(isTrue(null)).toBe(false);
    });

    it('should return true for a false (boolean) field', () => {
      expect(isTrue(false)).toBe(false);
    });

    it('should return false for a true (boolean) field', () => {
      expect(isTrue(true)).toBe(true);
    });

    it('should return false for an array field', () => {
      expect(isTrue([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(isTrue(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isTrue(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(isTrue(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(isTrue({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(isTrue('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(isTrue(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isUndefined() method', () => {
    it('should return false for a boolean value', () => {
      expect(isUndefined(true)).toBe(false);
    });

    it('should return false for an array value', () => {
      expect(isUndefined([])).toBe(false);
    });

    it('should return false for a date value', () => {
      expect(isUndefined(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isUndefined(new Error('Test'))).toBe(false);
    });

    it('should return false for a number value', () => {
      expect(isUndefined(5)).toBe(false);
    });

    it('should return false for an Object value', () => {
      expect(isUndefined({})).toBe(false);
    });

    it('should return true for a string value', () => {
      expect(isUndefined('test')).toBe(false);
    });

    it('should return false for a Regex value', () => {
      expect(isUndefined(new RegExp('test', 'g'))).toBe(false);
    });

    it('should return false for a null value', () => {
      expect(isUndefined(null)).toBe(false);
    });

    it('should return true for an undefined value', () => {
      expect(isUndefined(undefined)).toBe(true);
    });
  });

  describe('isUndefinedOrNull() method', () => {
    it('should return false for a boolean value', () => {
      expect(isUndefinedOrNull(true)).toBe(false);
    });

    it('should return false for an array value', () => {
      expect(isUndefinedOrNull([])).toBe(false);
    });

    it('should return false for a date value', () => {
      expect(isUndefinedOrNull(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(isUndefinedOrNull(new Error('Test'))).toBe(false);
    });

    it('should return false for a number value', () => {
      expect(isUndefinedOrNull(5)).toBe(false);
    });

    it('should return false for an Object value', () => {
      expect(isUndefinedOrNull({})).toBe(false);
    });

    it('should return true for a string value', () => {
      expect(isUndefinedOrNull('test')).toBe(false);
    });

    it('should return false for a Regex value', () => {
      expect(isUndefinedOrNull(new RegExp('test', 'g'))).toBe(false);
    });

    it('should return true for a null value', () => {
      expect(isUndefinedOrNull(null)).toBe(true);
    });

    it('should return true for an undefined value', () => {
      expect(isUndefinedOrNull(undefined)).toBe(true);
    });
  });

  describe('stringify() method', () => {
    it('should return a correctly stringified document with quotes', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const result = stringify(document);
      const expectedResult = '{\n'
                + '    "name": "value",\n'
                + '    "count": 1,\n'
                + '    "valid": true,\n'
                + '    "address": {\n'
                + '        "line1": "line1 value",\n'
                + '        "line2": "line2 value"\n'
                + '    },\n'
                + '    "options": [\n'
                + '        "email",\n'
                + '        "print"\n'
                + '    ]\n'
                + '}';

      expect(result).toBe(expectedResult);
    });

    it('should return a correctly stringified document without quoted fields', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const result = stringify(document, 4, '', false);
      const expectedResult = '{\n'
                + '    name: "value",\n'
                + '    count: 1,\n'
                + '    valid: true,\n'
                + '    address: {\n'
                + '        line1: "line1 value",\n'
                + '        line2: "line2 value"\n'
                + '    },\n'
                + '    options: [\n'
                + '        "email",\n'
                + '        "print"\n'
                + '    ]\n'
                + '}';

      expect(result).toBe(expectedResult);
    });

    it('should return a correctly stringified document with two space indenting', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'line2 value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const result = stringify(document, 2);
      const expectedResult = '{\n'
                + '  "name": "value",\n'
                + '  "count": 1,\n'
                + '  "valid": true,\n'
                + '  "address": {\n'
                + '    "line1": "line1 value",\n'
                + '    "line2": "line2 value"\n'
                + '  },\n'
                + '  "options": [\n'
                + '    "email",\n'
                + '    "print"\n'
                + '  ]\n'
                + '}';

      expect(result).toBe(expectedResult);
    });

    it('should return correctly stringified document with a line prefix', () => {
      const document = {
        name: 'value',
        count: 1,
        valid: true,
        address: {
          line1: 'line1 value',
          line2: 'https://line2.value',
        },
        options: [
          'email',
          'print',
        ],
      };

      const result = stringify(document, 4, '  ', false);
      const expectedResult = '{\n'
                + '      name: "value",\n'
                + '      count: 1,\n'
                + '      valid: true,\n'
                + '      address: {\n'
                + '          line1: "line1 value",\n'
                + '          line2: "https://line2.value"\n'
                + '      },\n'
                + '      options: [\n'
                + '          "email",\n'
                + '          "print"\n'
                + '      ]\n'
                + '  }';

      expect(result).toBe(expectedResult);
    });
  });
});
