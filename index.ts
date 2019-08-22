import crypto from 'crypto';
import fetch from 'node-fetch';
import { URL } from 'url';

export const FMexDomain = 'api.fmex.com';

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
  Params?: { [index: string]: string; };
}

/**
 * FMex请求发送
 */
export async function FMexAPI (FMexBaseParam: FMexBaseParam, FMexParam: FMexParam) {
  const time = Date.now().toString();
  const data = [] as string[];
  const params = [] as string[];
  const urlParse = new URL(FMexParam.Url);
  const secret = [`${FMexParam.Method}${FMexParam.Url}`];

  if (urlParse.host !== FMexDomain) {
    secret[0] = `${FMexParam.Method}${FMexParam.Url.replace(urlParse.host, FMexDomain)}`;
  }

  const url = new URL(FMexParam.Url);

  if (FMexParam.Body) {
    for (const arg in FMexParam.Body) data.push(`${arg}=${FMexParam.Body[arg]}`);
    FMexParam.Body = JSON.stringify(FMexParam.Body);
  }

  for (const arg in FMexParam.Params) {
    params.push(`${arg}=${FMexParam.Params[arg]}`);
    url.searchParams.set(arg, FMexParam.Params[arg]);
  }
  params.sort();
  data.sort();

  if (params.length) secret.push(`?${params.join('&')}`);

  secret.push(`${time}`);
  secret.push(`${data.join('&')}`);
  const signtmp = FMexSecret(secret.join(''), FMexBaseParam.APISecret);

  const headers = {
    'FC-ACCESS-KEY': FMexBaseParam.APIKey,
    'FC-ACCESS-SIGNATURE': signtmp,
    'FC-ACCESS-TIMESTAMP': time,
    'Content-Type': 'application/json;charset=UTF-8',
  };

  return new Promise<any>(resolve => {
    fetch(url.href, {
      method: FMexParam.Method,
      body: FMexParam.Body,
      headers,
      agent: FMexBaseParam.Agent,
    }).then(res => res.json()).then(res => {
      if (res.status === 'ok') res.status = 0; // 强制统一。这破FCoin的规范
      if (res.status) return resolve(res);
      return resolve(res);
    }).catch(error => {
      return resolve({ status: -1, error });
    });
  });
};

/**
 * 获取一个固定【基础参数的】句柄
 */
export function GetFMexAPI (FMexBaseParam: FMexBaseParam): (FMexParam: FMexParam) => Promise<any> {
  return FMexAPI.bind(null, FMexBaseParam);
}

function FMexSecret (str: string, Secret: string) {
  str = new Buffer(str).toString('base64');
  str = crypto.createHmac('sha1', Secret).update(str).digest().toString('base64');
  return str;
}
