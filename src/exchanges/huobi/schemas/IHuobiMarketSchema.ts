import { IHuobiSymbolSchema } from './IHuobiSymbolSchema'



export interface IHuobiMarketTickerSchema {
  symbol: string
  open: number
  high: number
  low: number
  close: number
  amount: number
  vol: number
  count: number
  bid: number
  bidSize: number
  ask: number
  askSize: number
}

export interface IHuobiMarketsSchema {
  huobiMarkets: IHuobiMarketTickerSchema[]
  rawSymbols: IHuobiSymbolSchema[]
}

export interface IHuobiMarketSchema {
  huobiMarket: IHuobiMarketTickerSchema
  rawSymbol: IHuobiSymbolSchema
}
