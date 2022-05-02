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
```

# Playground

Explore the AlunaJS Api live at:
  - https://playground.alunajs.com

# Contributting

 - [Getting Started](https://github.com/alunacrypto/alunajs)
 - [Scaffolding](https://github.com/alunacrypto/alunajs)
 - [Unit Tests](https://github.com/alunacrypto/alunajs)
 - [E2E tests](https://github.com/alunacrypto/alunajs)
 - [Integration Tests](https://github.com/alunacrypto/alunajs)

# Supported Exchanges

|Exchange|Spot|Margin|Futures|
| -- | -- | -- | -- |
|Bitfinex|✅ |❌|❌|
|BitMEX|—|—|❌|
|FTX|✅ |✅|✅|
|GateIO|✅ |❌|❌|
|Huobi|✅ |✅|✅|
|OkX|✅ |✅|✅|
|Poloniex|✅ |—|—|
|Valr|✅ |—|—|

# License

The MIT License (MIT)

Copyright (c) 2021 Aluna.Social
