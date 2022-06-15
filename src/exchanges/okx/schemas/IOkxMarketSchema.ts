import { IOkxSymbolSchema } from './IOkxSymbolSchema'



export interface IOkxMarketSchema {
  instType: string
  instId: string
  last: string
  lastSz: string
  askPx: string
  askSz: string
  bidPx: string
  bidSz: string
  open24h: string
  high24h: string
  low24h: string
  volCcy24h: string
  vol24h: string
  ts: string
  sodUtc0: string
  sodUtc8: string
}

export interface IOkxMarketsResponseSchema {
  rawMarkets: IOkxMarketSchema[]
  rawSymbols: IOkxSymbolSchema[]
}

export interface IOkxMarketResponseSchema {
  rawMarket: IOkxMarketSchema
  rawSpotSymbol?: IOkxSymbolSchema
  rawMarginSymbol?: IOkxSymbolSchema
}
