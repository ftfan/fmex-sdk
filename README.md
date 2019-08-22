# fmex-sdk
fmex js sdk

-----------------------

### Use

```ts
  import { GetFMexAPI } from 'fmex-sdk';

  const FMexRequest = GetFMexAPI({
    APIKey: 'xxxxxxxxxx',
    APISecret: 'xxxxxxxxxx',
    // Agent: ..., // if you want
  });

  FMexRequest({
    Method: 'POST',
    
  });
```