export type JsonNativeElement = boolean | number | string | object | undefined;

export type JsonElementType = IJsonObject | Array<IJsonObject> | Array<JsonNativeElement> | JsonNativeElement;

export type JsonArrayElementType = Array<IJsonObject> | Array<JsonNativeElement>;

export interface IJsonObject {
  [index: string]: JsonElementType
}
