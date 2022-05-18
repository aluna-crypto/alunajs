import { OkxMarketStatusEnum } from '../enums/OkxMarketStatusEnum'



// TODO: Describe market interface for Okx exchange
export interface IOkxMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: OkxMarketStatusEnum
  // ...
}
