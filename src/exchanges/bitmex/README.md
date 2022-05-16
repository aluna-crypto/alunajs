# Bitmex

 - API v1:
    - https://docs.bitmex.com/docs/introduction

## Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const settings: IAlunaSettingsSchema = {
  referralCode: 'ABC', // used for assembling signup url
  orderAnnotation: 'ABC', // used when placing orders
}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
}

const bitmex = aluna('bitmex', { settings })

bitmex.symbol.list()
```

## Features
  - [x] `offersOrderEditing`
  - [x] `offersPositionId`
