# Sample

 - API vX:
    - https://sample.com/api

## Usage

```ts
import {
  aluna,
  IAlunaCredentialsSchema,
  IAlunaSettingsSchema,
} from 'alunajs'



const settings: IAlunaSettingsSchema = {
  // ...
}

const credentials: IAlunaCredentialsSchema = {
  key: 'xxx',,
  secret: 'yyy',
}

const sample = aluna('sample', { settings })

sample.symbol.list()
```

## Features

| Functionality | Supported |
| -- | :-: |
| `offersOrderEditing` | ✅ |
| `offersPositionId` | ✅ |

## Notes

### API Rates
  - ...

### Orders
 - ...

### Positions
 - ...
