import { BittrexMarketStatusEnum } from '../enums/BittrexMarketStatusEnum'



export interface IBittrexMarketSummarySchema {
  symbol: string
  high: string
  low: string
  volume: string
  quoteVolume: string
  percentChange: string
  updatedAt: string
}

export interface IBittrexMarketTickerSchema {
  symbol: string
  lastTradeRate: string
  bidRate: string
  askRate: string
}

export interface IBittrexMarketInfoSchema {
  symbol: string
  baseCurrencySymbol: string
  quoteCurrencySymbol: string
  minTradeSize: number
  precision: number
  status: BittrexMarketStatusEnum
  createdAt: string
  notice: string
  prohibitedIn: string[]
  associatedTermsOfService: string[]
  tags: string[]
}

export interface IBittrexMarketSchema {
  summary: IBittrexMarketSummarySchema
  ticker: IBittrexMarketTickerSchema
  marketInfo: IBittrexMarketInfoSchema
}

export interface IBittrexMarketsSchema {
  summaries: IBittrexMarketSummarySchema[]
  tickers: IBittrexMarketTickerSchema[]
  marketsInfo: IBittrexMarketInfoSchema[]
}
