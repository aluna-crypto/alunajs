import { SampleMarketStatusEnum } from '../enums/SampleMarketStatusEnum'



export interface ISampleMarketSummarySchema {
  symbol: string
  high: string
  low: string
  volume: string
  quoteVolume: string
  percentChange: string
  updatedAt: string
}

export interface ISampleMarketTickerSchema {
  symbol: string
  lastTradeRate: string
  bidRate: string
  askRate: string
}

export interface ISampleMarketInfoSchema {
  symbol: string
  baseCurrencySymbol: string
  quoteCurrencySymbol: string
  minTradeSize: number
  precision: number
  status: SampleMarketStatusEnum
  createdAt: string
  notice: string
  prohibitedIn: string[]
  associatedTermsOfService: string[]
  tags: string[]
}

export interface ISampleMarketSchema {
  summary: ISampleMarketSummarySchema
  ticker: ISampleMarketTickerSchema
  marketInfo: ISampleMarketInfoSchema
}

export interface ISampleMarketsSchema {
  summaries: ISampleMarketSummarySchema[]
  tickers: ISampleMarketTickerSchema[]
  marketsInfo: ISampleMarketInfoSchema[]
}
