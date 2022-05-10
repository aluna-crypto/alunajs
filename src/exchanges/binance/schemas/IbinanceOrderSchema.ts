import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'



// TODO: Describe order interface for Binance exchange
export interface IBinanceOrderSchema {
  id: string
  symbol: string
  type: BinanceOrderTypeEnum
  // ...
}
