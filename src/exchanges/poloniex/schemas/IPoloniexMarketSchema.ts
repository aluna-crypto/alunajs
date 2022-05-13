export interface IPoloniexTickerSchema {
  id: number
  last: string
  lowestAsk: string
  highestBid: string
  percentChange: string
  baseVolume: string
  quoteVolume: string
  isFrozen: string
  postOnly: string
  marginTradingEnabled: string
  high24hr: string
  low24hr: string
}

export interface IPoloniexMarketSchema extends IPoloniexTickerSchema {
  baseCurrency: string
  quoteCurrency: string
  currencyPair: string
}

export interface IPoloniexMarketResponseSchema {
  [key: string]: IPoloniexTickerSchema
}
