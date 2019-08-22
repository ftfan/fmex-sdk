export declare const FMexDomain = "api.fmex.com";
/**
 * 基础参数
 */
export interface FMexBaseParam {
    APIKey: string;
    APISecret: string;
    Agent?: any;
}
/**
 * 每次请求参数
 */
export interface FMexParam {
    Method: 'POST' | 'GET' | 'DELETE' | 'PUT';
    Url: string;
    Body?: any;
    Params?: {
        [index: string]: string;
    };
}
/**
 * FMex请求发送
 */
export declare function FMexAPI(FMexBaseParam: FMexBaseParam, FMexParam: FMexParam): Promise<any>;
/**
 * 获取一个固定【基础参数的】句柄
 */
export declare function GetFMexAPI(FMexBaseParam: FMexBaseParam): (FMexParam: FMexParam) => Promise<any>;
