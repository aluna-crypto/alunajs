import { BinanceMarketStatusEnum } from '../enums/BinanceMarketStatusEnum'



// TODO: Describe market interface for Binance exchange
export interface IBinanceMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: BinanceMarketStatusEnum
  // ...
}
