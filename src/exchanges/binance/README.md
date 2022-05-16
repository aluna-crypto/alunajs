# Binance

 - API:
    - https://binance-docs.github.io/apidocs/

## Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
}

const binance = aluna('binance')

binance.symbol.list()
```

## Features
  - [ ] `offersOrderEditing`
  - [ ] `offersPositionId`
