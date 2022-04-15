export interface IHuobiMarketSchema {
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

export interface IHuobiMarketWithCurrency extends IHuobiMarketSchema {
  baseCurrency: string
  quoteCurrency: string
}
