"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAndRedact = exports.stringify = exports.clone = exports.redactUndefinedValues = exports.areEqual = exports.append = exports.isUndefined = exports.isDefined = exports.isString = exports.isRegExp = exports.isObject = exports.isNumber = exports.isError = exports.isEmpty = exports.isDate = exports.isBoolean = exports.isArray = void 0;
const deepEqual = require('deep-equal');
const clonedeep = require('lodash.clonedeep');
function isArray(value) {
    return ((value !== null) && ((value !== undefined))) && (typeof value === 'object') && (value.constructor === Array);
}
exports.isArray = isArray;
function isBoolean(value) {
    return ((value !== null) && ((value !== undefined))) && (typeof value === 'boolean');
}
exports.isBoolean = isBoolean;
function isDate(value) {
    return ((value !== null) && ((value !== undefined))) && (value instanceof Date);
}
exports.isDate = isDate;
function isEmpty(document) {
    return (!document) || (Object.keys(document).length === 0 && document.constructor === Object);
}
exports.isEmpty = isEmpty;
function isError(value) {
    return ((value !== null) && ((value !== undefined))) && (value instanceof Error) && (typeof value.message !== 'undefined');
}
exports.isError = isError;
function isNumber(value) {
    return ((value !== null) && ((value !== undefined))) && (typeof value === 'number') && isFinite(value);
}
exports.isNumber = isNumber;
function isObject(value) {
    return ((value !== null) && ((value !== undefined))) && (typeof value === 'object') && (value.constructor === Object);
}
exports.isObject = isObject;
function isRegExp(value) {
    return ((value !== null) && ((value !== undefined))) && (typeof value === 'object') && (value.constructor === RegExp);
}
exports.isRegExp = isRegExp;
function isString(value) {
    return ((value !== null) && ((value !== undefined))) && ((typeof value === 'string') || (value instanceof String));
}
exports.isString = isString;
function isDefined(value) {
    return (value !== undefined);
}
exports.isDefined = isDefined;
function isUndefined(value) {
    return (value === undefined);
}
exports.isUndefined = isUndefined;
function append(document, extensionDocument) {
    const doc = document || {};
    const extensionDoc = extensionDocument || {};
    const sourceKeys = Object.keys(extensionDoc);
    for (let i = 0; i < sourceKeys.length; i++) {
        if (isArray(extensionDoc[sourceKeys[i]])) {
            if (Object.prototype.hasOwnProperty.call(doc, sourceKeys[i])) {
                const sourceSet = new Set(doc[sourceKeys[i]]);
                const extensionSet = new Set(extensionDoc[sourceKeys[i]]);
                const mergedSet = new Set([...Array.from(sourceSet), ...Array.from(extensionSet)]);
                doc[sourceKeys[i]] = [...Array.from(mergedSet)];
            }
            else {
                doc[sourceKeys[i]] = extensionDoc[sourceKeys[i]];
            }
        }
        else if (isObject(extensionDoc[sourceKeys[i]])) {
            if (Object.prototype.hasOwnProperty.call(doc, sourceKeys[i])) {
                append(doc[sourceKeys[i]], extensionDoc[sourceKeys[i]]);
            }
            else {
                doc[sourceKeys[i]] = extensionDoc[sourceKeys[i]];
            }
        }
        else {
            doc[sourceKeys[i]] = extensionDoc[sourceKeys[i]];
        }
    }
    return doc;
}
exports.append = append;
function areEqual(firstObject, secondObject) {
    return deepEqual(firstObject, secondObject);
}
exports.areEqual = areEqual;
function redactUndefinedValues(document) {
    if (isArray(document)) {
        for (let index = document.length - 1; index >= 0; index--) {
            if (isDefined(document[index])) {
                redactUndefinedValues(document[index]);
            }
            else {
                document = document.splice(index, 1);
            }
        }
    }
    else if (isObject(document)) {
        for (const key in document) {
            if (Object.prototype.hasOwnProperty.call(document, key)) {
                if (isDefined(document[key])) {
                    redactUndefinedValues(document[key]);
                }
                else {
                    delete document[key];
                }
            }
        }
    }
}
exports.redactUndefinedValues = redactUndefinedValues;
function clone(value, shouldRedactUndefinedValues = true) {
    if (value) {
        const clonedDocument = clonedeep(value);
        if (shouldRedactUndefinedValues) {
            redactUndefinedValues(clonedDocument);
        }
        return clonedDocument;
    }
    return undefined;
}
exports.clone = clone;
function stringify(obj, indent = 4, linePrefix = '', quoteFieldNames = true) {
    const lines = JSON.stringify(obj, null, indent).split('\n');
    if (linePrefix !== '') {
        for (let i = 1; i < lines.length; i++) {
            lines[i] = linePrefix + lines[i];
        }
    }
    if (!quoteFieldNames) {
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
exports.stringify = stringify;
function extractAndRedact(document, propertyName) {
    if (Object.prototype.hasOwnProperty.call(document, propertyName)) {
        const value = JSON.parse(JSON.stringify(document[propertyName]));
        delete document[propertyName];
        return value;
    }
    return undefined;
}
exports.extractAndRedact = extractAndRedact;
