export declare type JsonNativeElement = boolean | number | string | undefined;
export declare type JsonElementType = IJsonObject | Array<IJsonObject> | Array<JsonNativeElement> | JsonNativeElement;
export declare type JsonArrayElementType = Array<IJsonObject> | Array<JsonNativeElement>;
export interface IJsonObject {
    [index: string]: JsonElementType;
}
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
export declare function clone(value: IJsonObject, shouldRedactUndefinedValues?: boolean): IJsonObject;
export declare function stringify(obj: object, indent?: number, linePrefix?: string, quoteFieldNames?: boolean): string;
export declare function extractAndRedact(document: IJsonObject, propertyName: string): IJsonObject;
