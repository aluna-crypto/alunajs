# Bitfinex

 - API v2:
    - https://docs.bitfinex.com/docs/introduction

## Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const settings: IAlunaSettingsSchema = {
  affiliateCode: 'XYZ', // used when placing orders
  referralCode: 'ABC', // used for assembling signup url
}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
}

const bitfinex = aluna('bitfinex', { settings, credentials })

bitfinex.symbol.list()
```

## Features

| Functionality | Supported |
| -- | :-: |
| `offersOrderEditing` | ✅ |
| `offersPositionId` | ❌ |


## Notes

### API Rates
 - Bitfinex API access is rate limited. For the REST API, an IP address can be rate limited if it has sent too many requests per minute. The current rate limit is between 10 and 90 requests per minute, depending on the specific REST API endpoint (i.e. /ticker). If an IP address is rate limited, the IP is blocked for 60 seconds and cannot make any requests during that time. If your IP address is rate limited, the API will return the JSON response `{ error: “ERR_RATE_LIMIT” }`.

### Orders
 - Bitfinex API has 2 endpoints for getting orders, one for open orders, and another one for filled/canceled orders. Usually, trying to get an order immediately after canceling it, or even after an order is filled (market orders) results in a server error.

### Positions
 - Bitfinex API does not returns detailed information from  previously closed positions.
