"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const url_1 = require("url");
exports.FMexDomain = 'api.fmex.com';
/**
 * FMex请求发送
 */
function FMexAPI(FMexBaseParam, FMexParam) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const time = Date.now().toString();
        const data = [];
        const params = [];
        const urlParse = new url_1.URL(FMexParam.Url);
        const secret = [`${FMexParam.Method}${FMexParam.Url}`];
        if (urlParse.host !== exports.FMexDomain) {
            secret[0] = `${FMexParam.Method}${FMexParam.Url.replace(urlParse.host, exports.FMexDomain)}`;
        }
        const url = new url_1.URL(FMexParam.Url);
        if (FMexParam.Body) {
            for (const arg in FMexParam.Body)
                data.push(`${arg}=${FMexParam.Body[arg]}`);
            FMexParam.Body = JSON.stringify(FMexParam.Body);
        }
        for (const arg in FMexParam.Params) {
            params.push(`${arg}=${FMexParam.Params[arg]}`);
            url.searchParams.set(arg, FMexParam.Params[arg]);
        }
        params.sort();
        data.sort();
        if (params.length)
            secret.push(`?${params.join('&')}`);
        secret.push(`${time}`);
        secret.push(`${data.join('&')}`);
        const signtmp = FMexSecret(secret.join(''), FMexBaseParam.APISecret);
        const headers = {
            'FC-ACCESS-KEY': FMexBaseParam.APIKey,
            'FC-ACCESS-SIGNATURE': signtmp,
            'FC-ACCESS-TIMESTAMP': time,
            'Content-Type': 'application/json;charset=UTF-8',
        };
        return new Promise(resolve => {
            node_fetch_1.default(url.href, {
                method: FMexParam.Method,
                body: FMexParam.Body,
                headers,
                agent: FMexBaseParam.Agent,
            }).then(res => res.json()).then(res => {
                if (res.status === 'ok')
                    res.status = 0; // 强制统一。这破FCoin的规范
                if (res.status)
                    return resolve(res);
                return resolve(res);
            }).catch(error => {
                return resolve({ status: -1, error });
            });
        });
    });
}
exports.FMexAPI = FMexAPI;
;
/**
 * 获取一个固定【基础参数的】句柄
 */
function GetFMexAPI(FMexBaseParam) {
    return FMexAPI.bind(null, FMexBaseParam);
}
exports.GetFMexAPI = GetFMexAPI;
function FMexSecret(str, Secret) {
    str = new Buffer(str).toString('base64');
    str = crypto_1.default.createHmac('sha1', Secret).update(str).digest().toString('base64');
    return str;
}
//# sourceMappingURL=index.js.map