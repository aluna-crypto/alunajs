# AlunaJS

Standardizing CryptoTrading APIs across multiple exchanges.

# Install

```
npm install alunajs
```

# Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const settings: IAlunaSettingsSchema = {
  // disableCache?: boolean,
  // cacheTtlInSeconds?: number,
  // disableCache?: boolean,
  // affiliateCode?: string,
  // orderAnnotation?: string,
  // referralCode?: string,
  // proxySettings?: IAlunaProxySchema,
  mappings: { XBT: 'BTC' },
}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
  // passphrase: 'zzz',
}



// —— public instance
const exchangePublic = aluna('bitfinex', { settings })

console.log(exchangePublic.specs)

apiPublic.symbol.list()
apiPublic.market.list()



// —— authed instance (`credentials` required)
const exchangeAuthed = aluna('bitfinex', {
  settings,
  credentials, // <- here
})

apiAuthed.key.fetchDetails()

apiAuthed.balance.list({ ... })
apiAuthed.balance.getTradableBalance({ ... })

apiAuthed.order.list({ ... })
apiAuthed.order.place({ ... })
apiAuthed.order.edit({ ... })
apiAuthed.order.cancel({ ... })

apiAuthed.position.list({ ... })
apiAuthed.position.setLeverage({ ... })
apiAuthed.position.close({ ... })

```

# Web3

```ts
import {
  aluna,
  Web3ChainsEnum,
} from 'alunajs'

const web3 = aluna.web3(/* settings?: IAlunaSettings */)

const web3Address = '0xA8...'
const chainId = Web3ChainsEnum.ETHEREUM

web3.balance.getTotalBalance({ address })
web3.balance.list({ address })

web3.token.list({ address, chainId })
```


# Integrations

Full list of supported exchanges here:
 - [Supported Exchanges](docs/exchanges-table.md)


# Getting Involved

 1. [Contributing](docs/contributing.md)
 1. [Playground](.playground)
 1. [Scaffolding](.scaffolding) (_adding a new exchange_)
 1. [Unit Tests](test)
 1. [Integration Tests](test/e2e)


# License

The MIT License (MIT)

Copyright (c) 2021 Aluna.Social
