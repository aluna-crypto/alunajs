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
