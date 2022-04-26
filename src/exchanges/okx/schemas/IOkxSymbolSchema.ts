import { OkxSymbolStatusEnum } from '../enums/OkxSymbolStatusEnum'



export interface IOkxSymbolSchema {
  instType: string
  instId: string
  uly: string
  category: string
  baseCcy: string
  quoteCcy: string
  settleCcy: string
  ctVal: string
  ctMult: string
  ctValCcy: string
  optType: string
  stk: string
  listTime: string
  expTime: string
  lever: string
  tickSz: string
  lotSz: string
  minSz: string
  ctType: string
  alias: string
  state: OkxSymbolStatusEnum
}
