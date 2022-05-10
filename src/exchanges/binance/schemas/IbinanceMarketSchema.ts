import { binanceMarketStatusEnum } from '../enums/binanceMarketStatusEnum'



// TODO: Describe market interface for binance exchange
export interface IbinanceMarketSchema {
  symbol: string
  volume: string
  quoteVolume: string
  status: binanceMarketStatusEnum
  // ...
}
