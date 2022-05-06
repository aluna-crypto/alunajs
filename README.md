# AlunaJS

Standardizing CryptoTrading APIs across multiple exchanges, for NodeJS.

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


const settings: IAlunaSettingsSchema = {}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
  // passphrase: 'zzz',
}


// Public instance
const exchangePublic = aluna('bitfinex', { settings })

console.log(exchangePublic.specs)

apiPublic.symbol.list()
apiPublic.market.list()


// Authed instance (`credentials` required)
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

const web3 = aluna.web3()

const web3Address = '0xA8...'
const chainId = Web3ChainsEnum.ETHEREUM

web3.balance.getTotalBalance({ address })
web3.balance.list({ address })

web3.token.list({ address, chainId })
```


# Integrations

Full list of supported exchanges here:
 - [Supported Exchanges]([http://](https://github.com/alunacrypto/alunajs))


# Contributting

 1. [Getting Started](docs/contributing.md)
 1. [Playground](.playground)
 1. [Scaffolding](.scaffolding)
 1. [Unit Tests](test)
 3. [Integration Tests](test/e2e)


# License

The MIT License (MIT)

Copyright (c) 2021 Aluna.Social
