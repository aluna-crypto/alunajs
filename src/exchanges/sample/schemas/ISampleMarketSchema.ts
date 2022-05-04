import { SampleMarketStatusEnum } from '../enums/SampleMarketStatusEnum'



// TODO: Describe market interface for Sample exchange
export interface ISampleMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: SampleMarketStatusEnum
  // ...
}
