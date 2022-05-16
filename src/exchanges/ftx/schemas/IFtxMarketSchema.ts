import { FtxMarketStatusEnum } from '../enums/FtxMarketStatusEnum'



// TODO: Describe market interface for Ftx exchange
export interface IFtxMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: FtxMarketStatusEnum
  // ...
}
