// const HttpsProxyAgent = require('https-proxy-agent');
import { expect } from 'chai';
import 'mocha';
// import { describe } from 'mocha';
import { GetFMexAPI } from '../dist/index';
import { UserConfig } from './config';

const FMexRequest = GetFMexAPI({
  APIKey: UserConfig.ApiKey,
  APISecret: UserConfig.ApiSecret,
  // Agent: ..., // if you want
});

describe('api.ts', () => {
  it('contracts/symbols', async function () {
    const res = await FMexRequest({
      Method: 'POST',
      Url: 'https://api.fmex.com/v2/public/contracts/symbols',
    });
    console.log(res);
    expect(res.status).to.equal(0);
  });
});
