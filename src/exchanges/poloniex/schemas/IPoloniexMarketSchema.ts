import { PoloniexMarketStatusEnum } from '../enums/PoloniexMarketStatusEnum'



// TODO: Describe market interface for Poloniex exchange
export interface IPoloniexMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: PoloniexMarketStatusEnum
  // ...
}
