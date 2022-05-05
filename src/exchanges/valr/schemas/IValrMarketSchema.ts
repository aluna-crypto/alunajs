import { ValrMarketStatusEnum } from '../enums/ValrMarketStatusEnum'



// TODO: Describe market interface for Valr exchange
export interface IValrMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: ValrMarketStatusEnum
  // ...
}
