# Bittrex

 - API v3:
    - https://bittrex.github.io/api/v3

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

const bittrex = aluna('bittrex', { settings, credentials })

bittrex.symbol.list()
```

## Features

| Functionality | Supported |
| -- | :-: |
| `offersOrderEditing` | ❌ |
| `offersPositionId` | ❌ |
