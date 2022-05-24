# FtxFtx

- API:
  - https://docs.ftx.com/

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

const ftx = aluna('ftx', { credentials })

ftx.symbol.list()
```

## Features

| Functionality        | Supported |
| -------------------- | :-------: |
| `offersOrderEditing` |    ❌     |
| `offersPositionId`   |    ❌     |
