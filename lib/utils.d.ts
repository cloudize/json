import { IJsonObject, JsonElementType } from '.';
export declare function isArray(value: JsonElementType | object): boolean;
export declare function isBoolean(value: JsonElementType | object): boolean;
export declare function isDate(value: JsonElementType | object): boolean;
export declare function isEmpty(document: JsonElementType | object): boolean;
export declare function isError(value: JsonElementType | object): boolean;
export declare function isNumber(value: JsonElementType | object): boolean;
export declare function isObject(value: JsonElementType | object): boolean;
export declare function isRegExp(value: JsonElementType | object): boolean;
export declare function isString(value: JsonElementType | object): boolean;
export declare function isDefined(value: JsonElementType | object): boolean;
export declare function isUndefined(value: JsonElementType | object): boolean;
export declare function append(document: JsonElementType, extensionDocument: JsonElementType): JsonElementType;
export declare function areEqual(firstObject: JsonElementType, secondObject: JsonElementType): boolean;
export declare function redactUndefinedValues(document: JsonElementType): void;
export declare function clone(value: JsonElementType, shouldRedactUndefinedValues?: boolean): JsonElementType;
export declare function stringify(obj: JsonElementType, indent?: number, linePrefix?: string, quoteFieldNames?: boolean): string;
export declare function extractAndRedact(document: IJsonObject, propertyName: string): JsonElementType;