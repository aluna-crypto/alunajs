# Sample

 - API v5:
    - https://www.okx.com/api/v5

## Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const settings: IAlunaSettingsSchema = {
  key: 'key',
  secret: 'secret',
  passphrase: 'passphrase'
}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
}

const okx = aluna('okx', { settings })

okx.symbol.list()
```

## Features

| Functionality | Supported |
| -- | :-: |
| `offersOrderEditing` | ✅ |
| `offersPositionId` | ✅ |
