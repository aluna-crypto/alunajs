export interface IValrMarketSummarySchema {
  currencyPair: string
  askPrice: string
  bidPrice: string
  lastTradedPrice: string
  previousClosePrice: string
  baseVolume: string
  highPrice: string
  lowPrice: string
  created: string
  changeFromPrevious: string
}

export interface IValrMarketCurrencyPairs {
  symbol: string
  baseCurrency: string
  quoteCurrency: string
  shortName: string
  active: boolean
  minBaseAmount: string
  maxBaseAmount: string
  minQuoteAmount: string
  maxQuoteAmount: string
  tickSize: string
  baseDecimalPlaces: string
}


export interface IValrMarketSchema {
  summary: IValrMarketSummarySchema
  pair: IValrMarketCurrencyPairs
}

export interface IValrMarketsSchema {
  summaries: IValrMarketSummarySchema[]
  pairs: IValrMarketCurrencyPairs[]
}
