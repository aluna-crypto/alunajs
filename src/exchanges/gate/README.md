# Gate

 - API v4:
    - https://docs.gate.com/docs/introduction

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

const gate = aluna('gate', { settings, credentials })

gate.symbol.list()
```

## Features

| Functionality | Supported |
| -- | :-: |
| `offersOrderEditing` | ❌ |
| `offersPositionId` | ❌ |
