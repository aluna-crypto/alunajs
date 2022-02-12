import { AlunaInstrumentStateEnum } from '../enums/AlunaInstrumentStateEnum'



// TODO: trim interface down to what is essential
export interface IAlunaInstrumentSchema {

  // possible useless properties
  name: string
  splittedName: string
  state: AlunaInstrumentStateEnum
  openDate: Date
  closeDate: Date
  listingDate: Date
  frontDate: Date
  expireDate: Date
  settleDate: Date
  sessionIntervalDate: Date

  // probable required properties
  price: number
  isInverse: boolean
  rateSymbolId: string
  totalSymbolId: string
  amountSymbolId: string
  contractValue: number
  minTradeAmount: number
  usdPricePerUnit?: number // Available only when `isTradedByUnitsOfContract`
  contractCurrency: string
  orderValueMultiplier?: number
  isTradedByUnitsOfContract: boolean
}
