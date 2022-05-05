import { BitfinexMarketStatusEnum } from '../enums/BitfinexMarketStatusEnum'



// TODO: Describe market interface for Bitfinex exchange
export interface IBitfinexMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: BitfinexMarketStatusEnum
  // ...
}
