import { GateMarketStatusEnum } from '../enums/GateMarketStatusEnum'



// TODO: Describe market interface for Gate exchange
export interface IGateMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: GateMarketStatusEnum
  // ...
}
