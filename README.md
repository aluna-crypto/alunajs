# AlunaJS

Standardizing APIs across multiple exchanges with focus on Crypto Trading.

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


// Authed instance
const exchangeAuthed = aluna('bitfinex', { settings, credentials })

apiAuthed.key.fetchDetails()
apiAuthed.balance.list()
apiAuthed.order.list()
apiAuthed.position.list()


// Web3
const { web3 } = aluna.web3()

const web3Address = '0xA8...'
const chainId = Web3DebankChainsEnum.ETHEREUM

web3.balance.getTotalBalance({ address })
web3.balance.list({ address })

web3.token.list({ address, chainId } })
```

# Supported Exchanges

Full list here:
 - [Supported Exchanges](http://)

# Playground

Explore the AlunaJS Api live at:
  - https://playground.alunajs.com

# Contributting

 - [Getting Started](https://github.com/alunacrypto/alunajs)
 - [Scaffolding](https://github.com/alunacrypto/alunajs)
 - [Unit Tests](https://github.com/alunacrypto/alunajs)
 - [E2E tests](https://github.com/alunacrypto/alunajs)
 - [Integration Tests](https://github.com/alunacrypto/alunajs)

# License

The MIT License (MIT)

Copyright (c) 2021 Aluna.Social
