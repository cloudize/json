const jsonUtils = require('../../../lib');

describe('The JSON Utils', () => {
  describe('append() method', () => {
    it('should return an object containing the extension if the document is undefined', () => {
      expect(jsonUtils.append(undefined, { a: 1 })).toEqual({ a: 1 });
    });

    it('should return the original value if the extension is undefined', () => {
      expect(jsonUtils.append({}, undefined)).toEqual({});
    });

    it('should return an extended object if both the original value and the extension are defined', () => {
      expect(jsonUtils.append({ a: 1 }, { b: 'Hello' })).toEqual({ a: 1, b: 'Hello' });
    });

    it('should return an extended object with a value being overriden if both the original value and the extension are '
      + 'defined and they have a common element', () => {
      expect(jsonUtils.append({ a: 1, b: 1 }, { b: 2, c: 'Hello' })).toEqual({ a: 1, b: 2, c: 'Hello' });
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

      expect(jsonUtils.append(document, extensionDocument)).toEqual(expectedResult);
    });
  });

  describe('areEqual() method', () => {
    it('should return true for two undefined inputs', () => {
      expect(jsonUtils.areEqual(undefined, undefined)).toBe(true);
    });

    it('should return false if one input is undefined and one is an empty object', () => {
      expect(jsonUtils.areEqual({ }, undefined)).toBe(false);
    });

    it('should return false if the two inputs have the same elements, but not the same values', () => {
      expect(jsonUtils.areEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('should return false if the two inputs have different elements, but the same values', () => {
      expect(jsonUtils.areEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it('should return true if the two simple documents that are equal', () => {
      expect(jsonUtils.areEqual({ a: 1 }, { a: 1 })).toBe(true);
    });

    it('should return true if the two simple documents including dates', () => {
      const testdate = new Date();
      expect(jsonUtils.areEqual({ a: 1, date: testdate }, { a: 1, date: testdate })).toBe(true);
    });

    it('should return true if the two complex documents that are equal but where the elements are not in the '
      + 'same order', () => {
      expect(jsonUtils.areEqual(
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
      const outputDocument = jsonUtils.clone(undefined);
      expect(outputDocument).toBeUndefined();
    });

    it('should return an empty output for an empty input', () => {
      const outputDocument = jsonUtils.clone({});
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

      const outputDocument = jsonUtils.clone(document);
      expect(outputDocument).not.toBe(document);
      expect(outputDocument).toEqual(document);
    });

    it('should return an output document that excludes undefined fields in the input document', () => {
      const document = {
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

      const outputDocument = jsonUtils.clone(document);

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

      const gender = jsonUtils.extractAndRedact(document, 'gender');
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

      const name = jsonUtils.extractAndRedact(document, 'name');
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

      const count = jsonUtils.extractAndRedact(document, 'count');
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

      const valid = jsonUtils.extractAndRedact(document, 'valid');
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

      const address = jsonUtils.extractAndRedact(document, 'address');
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

      const options = jsonUtils.extractAndRedact(document, 'options');
      expect(options).toBeDefined();
      expect(options).toEqual(['email', 'print']);
      expect(Object.prototype.hasOwnProperty.call(document, 'options')).toBe(false);
    });
  });

  describe('hasProperty() method', () => {
    it('should return false for an undefined object', () => {
      const result = jsonUtils.hasProperty(undefined, 'property');
      expect(result).toBe(false);
    });

    it('should return false for an invalid object', () => {
      const result = jsonUtils.hasProperty(5, 'property');
      expect(result).toBe(false);
    });

    it('should return false for an array', () => {
      const result = jsonUtils.hasProperty([], 'property');
      expect(result).toBe(false);
    });

    it('should return false for an object without the property', () => {
      const result = jsonUtils.hasProperty({}, 'property');
      expect(result).toBe(false);
    });

    it('should return true for an object with the property', () => {
      const result = jsonUtils.hasProperty({ property: 1 }, 'property');
      expect(result).toBe(true);
    });
  });

  describe('isArray() method', () => {
    it('should return true for an empty array', () => {
      const result = jsonUtils.isArray([]);
      expect(result).toBe(true);
    });

    it('should return true for an array with simple items', () => {
      const result = jsonUtils.isArray(['Bob', 'Frank', 'Sue']);
      expect(result).toBe(true);
    });

    it('should return true for an array with object items', () => {
      const result = jsonUtils.isArray([{ name: 'Bob' }, { name: 'Frank' }, { name: 'Sue' }]);
      expect(result).toBe(true);
    });

    it('should return false for an undefined document', () => {
      const result = jsonUtils.isArray(undefined);
      expect(result).toBe(false);
    });

    it('should return false for an empty object', () => {
      const result = jsonUtils.isArray({});
      expect(result).toBe(false);
    });

    it('should return false for a document with a string element', () => {
      const result = jsonUtils.isArray({ name: 'value' });
      expect(result).toBe(false);
    });
  });

  describe('isBoolean() method', () => {
    it('should return true for a boolean field', () => {
      expect(jsonUtils.isBoolean(true)).toBe(true);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isBoolean([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isBoolean(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isBoolean(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isBoolean(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isBoolean({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isBoolean('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isBoolean(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isDate() method', () => {
    it('should return false for a boolean field', () => {
      expect(jsonUtils.isDate(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isDate([])).toBe(false);
    });

    it('should return true for an date field', () => {
      expect(jsonUtils.isDate(new Date())).toBe(true);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isDate(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isDate(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isDate({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isDate('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isDate(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isDefined() method', () => {
    it('should return true for a boolean value', () => {
      expect(jsonUtils.isDefined(true)).toBe(true);
    });

    it('should return true for an array value', () => {
      expect(jsonUtils.isDefined([])).toBe(true);
    });

    it('should return true for a date value', () => {
      expect(jsonUtils.isDefined(new Date())).toBe(true);
    });

    it('should return true for an error object', () => {
      expect(jsonUtils.isDefined(new Error('Test'))).toBe(true);
    });

    it('should return true for a number value', () => {
      expect(jsonUtils.isDefined(5)).toBe(true);
    });

    it('should return true for an Object value', () => {
      expect(jsonUtils.isDefined({})).toBe(true);
    });

    it('should return true for a string value', () => {
      expect(jsonUtils.isDefined('test')).toBe(true);
    });

    it('should return true for a Regex value', () => {
      expect(jsonUtils.isDefined(new RegExp('test', 'g'))).toBe(true);
    });

    it('should return true for a null value', () => {
      expect(jsonUtils.isDefined(null)).toBe(true);
    });

    it('should return true for an undefined value', () => {
      expect(jsonUtils.isDefined(undefined)).toBe(false);
    });
  });

  describe('isDefinedAndNotNull() method', () => {
    it('should return true for a boolean value', () => {
      expect(jsonUtils.isDefinedAndNotNull(true)).toBe(true);
    });

    it('should return true for an array value', () => {
      expect(jsonUtils.isDefinedAndNotNull([])).toBe(true);
    });

    it('should return true for a date value', () => {
      expect(jsonUtils.isDefinedAndNotNull(new Date())).toBe(true);
    });

    it('should return true for an error object', () => {
      expect(jsonUtils.isDefinedAndNotNull(new Error('Test'))).toBe(true);
    });

    it('should return true for a number value', () => {
      expect(jsonUtils.isDefinedAndNotNull(5)).toBe(true);
    });

    it('should return true for an Object value', () => {
      expect(jsonUtils.isDefinedAndNotNull({})).toBe(true);
    });

    it('should return true for a string value', () => {
      expect(jsonUtils.isDefinedAndNotNull('test')).toBe(true);
    });

    it('should return true for a Regex value', () => {
      expect(jsonUtils.isDefinedAndNotNull(new RegExp('test', 'g'))).toBe(true);
    });

    it('should return false for a null value', () => {
      expect(jsonUtils.isDefinedAndNotNull(null)).toBe(false);
    });

    it('should return false for an undefined value', () => {
      expect(jsonUtils.isDefinedAndNotNull(undefined)).toBe(false);
    });
  });

  describe('isEmpty() method', () => {
    it('should return true for an undefined document', () => {
      const result = jsonUtils.isEmpty(undefined);
      expect(result).toBe(true);
    });

    it('should return true for an empty document', () => {
      const result = jsonUtils.isEmpty({});
      expect(result).toBe(true);
    });

    it('should return false for a document with a string element', () => {
      const result = jsonUtils.isEmpty({ name: 'value' });
      expect(result).toBe(false);
    });

    it('should return false for a document containing a sub document', () => {
      const result = jsonUtils.isEmpty({ name: { value: 1 } });
      expect(result).toBe(false);
    });

    it('should return false for a document containing an array', () => {
      const result = jsonUtils.isEmpty({ names: ['value'] });
      expect(result).toBe(false);
    });
  });

  describe('isError() method', () => {
    it('should return false for a boolean field', () => {
      expect(jsonUtils.isError(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isError([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isError(new Date())).toBe(false);
    });

    it('should return true for an error object', () => {
      expect(jsonUtils.isError(new Error('Test'))).toBe(true);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isError(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isError({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isError('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isError(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isFalse() method', () => {
    it('should return false for an undefined value', () => {
      expect(jsonUtils.isFalse(undefined)).toBe(false);
    });

    it('should return false for a null value', () => {
      expect(jsonUtils.isFalse(null)).toBe(false);
    });

    it('should return false for a true (boolean) field', () => {
      expect(jsonUtils.isFalse(true)).toBe(false);
    });

    it('should return true for a false (boolean) field', () => {
      expect(jsonUtils.isFalse(false)).toBe(true);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isFalse([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isFalse(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isFalse(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isFalse(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isFalse({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isFalse('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isFalse(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isNumber() method', () => {
    it('should return false for a boolean field', () => {
      expect(jsonUtils.isNumber(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isNumber([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isNumber(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isNumber(new Error('Test'))).toBe(false);
    });

    it('should return true for an number field', () => {
      expect(jsonUtils.isNumber(5)).toBe(true);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isNumber({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isNumber('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isNumber(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isObject() method', () => {
    it('should return true for an empty object', () => {
      const result = jsonUtils.isObject({});
      expect(result).toBe(true);
    });

    it('should return true for an object with values', () => {
      const result = jsonUtils.isObject({ name: 'Bob' });
      expect(result).toBe(true);
    });

    it('should return false for an undefined document', () => {
      const result = jsonUtils.isObject(undefined);
      expect(result).toBe(false);
    });

    it('should return false for an array', () => {
      const result = jsonUtils.isObject([]);
      expect(result).toBe(false);
    });
  });

  describe('isRegExp() method', () => {
    it('should return false for a boolean field', () => {
      expect(jsonUtils.isRegExp(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isRegExp([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isRegExp(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isRegExp(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isRegExp(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isRegExp({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isRegExp('test')).toBe(false);
    });

    it('should return true for an Regex field', () => {
      expect(jsonUtils.isRegExp(new RegExp('test', 'g'))).toBe(true);
    });
  });

  describe('isString() method', () => {
    it('should return false for a boolean field', () => {
      expect(jsonUtils.isString(true)).toBe(false);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isString([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isString(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isString(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isString(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isString({})).toBe(false);
    });

    it('should return true for an string field', () => {
      expect(jsonUtils.isString('test')).toBe(true);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isString(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isTrue() method', () => {
    it('should return false for an undefined value', () => {
      expect(jsonUtils.isTrue(undefined)).toBe(false);
    });

    it('should return false for a null value', () => {
      expect(jsonUtils.isTrue(null)).toBe(false);
    });

    it('should return true for a false (boolean) field', () => {
      expect(jsonUtils.isTrue(false)).toBe(false);
    });

    it('should return false for a true (boolean) field', () => {
      expect(jsonUtils.isTrue(true)).toBe(true);
    });

    it('should return false for an array field', () => {
      expect(jsonUtils.isTrue([])).toBe(false);
    });

    it('should return false for an date field', () => {
      expect(jsonUtils.isTrue(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isTrue(new Error('Test'))).toBe(false);
    });

    it('should return false for an number field', () => {
      expect(jsonUtils.isTrue(5)).toBe(false);
    });

    it('should return false for an Object field', () => {
      expect(jsonUtils.isTrue({})).toBe(false);
    });

    it('should return false for an string field', () => {
      expect(jsonUtils.isTrue('test')).toBe(false);
    });

    it('should return false for an Regex field', () => {
      expect(jsonUtils.isTrue(new RegExp('test', 'g'))).toBe(false);
    });
  });

  describe('isUndefined() method', () => {
    it('should return false for a boolean value', () => {
      expect(jsonUtils.isUndefined(true)).toBe(false);
    });

    it('should return false for an array value', () => {
      expect(jsonUtils.isUndefined([])).toBe(false);
    });

    it('should return false for a date value', () => {
      expect(jsonUtils.isUndefined(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isUndefined(new Error('Test'))).toBe(false);
    });

    it('should return false for a number value', () => {
      expect(jsonUtils.isUndefined(5)).toBe(false);
    });

    it('should return false for an Object value', () => {
      expect(jsonUtils.isUndefined({})).toBe(false);
    });

    it('should return true for a string value', () => {
      expect(jsonUtils.isUndefined('test')).toBe(false);
    });

    it('should return false for a Regex value', () => {
      expect(jsonUtils.isUndefined(new RegExp('test', 'g'))).toBe(false);
    });

    it('should return false for a null value', () => {
      expect(jsonUtils.isUndefined(null)).toBe(false);
    });

    it('should return true for an undefined value', () => {
      expect(jsonUtils.isUndefined(undefined)).toBe(true);
    });
  });

  describe('isUndefinedOrNull() method', () => {
    it('should return false for a boolean value', () => {
      expect(jsonUtils.isUndefinedOrNull(true)).toBe(false);
    });

    it('should return false for an array value', () => {
      expect(jsonUtils.isUndefinedOrNull([])).toBe(false);
    });

    it('should return false for a date value', () => {
      expect(jsonUtils.isUndefinedOrNull(new Date())).toBe(false);
    });

    it('should return false for an error object', () => {
      expect(jsonUtils.isUndefinedOrNull(new Error('Test'))).toBe(false);
    });

    it('should return false for a number value', () => {
      expect(jsonUtils.isUndefinedOrNull(5)).toBe(false);
    });

    it('should return false for an Object value', () => {
      expect(jsonUtils.isUndefinedOrNull({})).toBe(false);
    });

    it('should return true for a string value', () => {
      expect(jsonUtils.isUndefinedOrNull('test')).toBe(false);
    });

    it('should return false for a Regex value', () => {
      expect(jsonUtils.isUndefinedOrNull(new RegExp('test', 'g'))).toBe(false);
    });

    it('should return true for a null value', () => {
      expect(jsonUtils.isUndefinedOrNull(null)).toBe(true);
    });

    it('should return true for an undefined value', () => {
      expect(jsonUtils.isUndefinedOrNull(undefined)).toBe(true);
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

      const result = jsonUtils.stringify(document);
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

      const result = jsonUtils.stringify(document, 4, '', false);
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

      const result = jsonUtils.stringify(document, 2);
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

      const result = jsonUtils.stringify(document, 4, '  ', false);
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
