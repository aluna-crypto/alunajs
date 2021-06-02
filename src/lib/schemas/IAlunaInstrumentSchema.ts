import { InstrumentStateEnum } from '../enums/InstrumentStateEnum'



// TODO: trim interface down to what is essential
export interface IAlunaInstrumentSchema {
  name: string
  state: InstrumentStateEnum
  openDate: Date
  closeDate: Date
  listingDate: Date
  frontDate: Date
  expireDate: Date
  settleDate: Date
  sessionIntervalDate: Date
  price: number
  btcPricePerUnit: number
  usdPricePerUnit: number
  isTradedByUnitsOfContract?: boolean
}
