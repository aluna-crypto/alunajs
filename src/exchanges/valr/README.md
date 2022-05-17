# Valr

 - API v1:
    - https://docs.valr.com/

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

const valr = aluna('valr', { settings, credentials })

valr.symbol.list()
```

## Features

| Functionality | Supported |
| -- | :-: |
| `offersOrderEditing` | ❌ |
| `offersPositionId` | ❌ |
