import { BitmexMarketStatusEnum } from '../enums/BitmexMarketStatusEnum'



// TODO: Describe market interface for Bitmex exchange
export interface IBitmexMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: BitmexMarketStatusEnum
  // ...
}
