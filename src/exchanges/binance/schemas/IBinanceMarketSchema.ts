import { IBinanceSymbolSchema } from './IBinanceSymbolSchema'



export interface IBinanceMarketSchema {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

export interface IBinanceMarketsResponseSchema {
  rawTickers: IBinanceMarketSchema[]
  rawSymbols: IBinanceSymbolSchema[]
}

export interface IBinanceMarketResponseSchema {
  rawTicker: IBinanceMarketSchema
  rawSymbol: IBinanceSymbolSchema
}
