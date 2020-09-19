export declare type JsonNativeElement = boolean | number | string | undefined;
export declare type JsonElementType = IJsonObject | Array<IJsonObject> | Array<JsonNativeElement> | JsonNativeElement;
export declare type JsonArrayElementType = Array<IJsonObject> | Array<JsonNativeElement>;
export interface IJsonObject {
    [index: string]: JsonElementType;
}
