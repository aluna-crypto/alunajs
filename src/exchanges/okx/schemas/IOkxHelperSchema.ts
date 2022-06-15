import { IAlunaHttp } from '../../../lib/core/IAlunaHttp'
import { IAlunaSettingsSchema } from '../../../lib/schemas/IAlunaSettingsSchema'
import { OkxSymbolTypeEnum } from '../enums/OkxSymbolTypeEnum'
import { IOkxSymbolSchema } from './IOkxSymbolSchema'



export interface IOkxFetchInstrumentsHelperParams {
  http: IAlunaHttp
  settings: IAlunaSettingsSchema
  type: OkxSymbolTypeEnum
}

export interface IOkxFetchInstrumentsHelperReturns {
  instruments: IOkxSymbolSchema[]
}
