import { HuobiMarketStatusEnum } from '../enums/HuobiMarketStatusEnum'



// TODO: Describe market interface for Huobi exchange
export interface IHuobiMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: HuobiMarketStatusEnum
  // ...
}
