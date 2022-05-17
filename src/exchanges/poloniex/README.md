# Poloniex

 - API v1:
    - https://docs.poloniex.com/#introduction

## Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const settings: IAlunaSettingsSchema = {
  referralCode: 'ABC', // used for assembling signup url
}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
}

const poloniex = aluna('poloniex', { settings, credentials })

poloniex.symbol.list()
```

## Features
  - [ ] `offersOrderEditing`
  - [ ] `offersPositionId`
