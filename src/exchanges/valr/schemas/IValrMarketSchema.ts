import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'



export interface IValrMarketSchema {
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

export interface IValrCurrencyPairs {
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

export interface IMarketWithCurrencies extends IValrMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}

export interface IValrMarketCurrencyParserResponseSchema {
  rawMarketsWithCurrency: IMarketWithCurrencies[]
  apiRequestCount: number
}

export interface IValrMarketParserResponseSchema {
  market: IAlunaMarketSchema
  apiRequestCount: number
}

export interface IValrMarketResponseSchema {
  markets: IValrMarketSchema[]
  apiRequestCount: number
}

export interface IValrCurrencyPairsResponseSchema {
  currencyPairs: IValrCurrencyPairs[]
  apiRequestCount: number
}
