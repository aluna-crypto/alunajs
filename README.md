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
  credentials,
})

apiAuthed.key.fetchDetails()

apiAuthed.balance.list({ /* ... */})
apiAuthed.balance.getTradableBalance({ /* ... */})

apiAuthed.order.list({ /* ... */})
apiAuthed.order.place({ /* ... */})
apiAuthed.order.edit({ /* ... */})
apiAuthed.order.cancel({ /* ... */})

apiAuthed.position.list({ /* ... */})
apiAuthed.position.setLeverage({ /* ... */})
apiAuthed.position.close({ /* ... */})


// Web3
const web3 = aluna.web3()

const web3Address = '0xA8...'
const chainId = Web3DebankChainsEnum.ETHEREUM

web3.balance.getTotalBalance({ address })
web3.balance.list({ address })

web3.token.list({ address, chainId })
```

# Integrations

Full list of supported exchanges here:
 - [Supported Exchanges]([http://](https://github.com/alunacrypto/alunajs))

# Extras

Some extra modules and utilities:
 - [Web3]([http://](https://github.com/alunacrypto/alunajs))

# Contributting

 1. [Getting Started](https://github.com/alunacrypto/alunajs)
 1. [Playground](https://github.com/alunacrypto/playground)
 1. [Scaffolding](https://github.com/alunacrypto/alunajs)
 1. [Unit Tests](https://github.com/alunacrypto/alunajs)
 1. [Integration Tests](https://github.com/alunacrypto/alunajs)

# License

The MIT License (MIT)

Copyright (c) 2021 Aluna.Social
