export interface IBitfinexMarketsSchema {
  tickers: IBitfinexTicker[]
  enabledMarginCurrencies: string[][]
}


export interface IBitfinexMarketSchema {
  ticker: IBitfinexTicker
  enabledMarginCurrency: string | undefined
}



export interface IBitfinexTicker extends TBitfinexTicker {}



type TBitfinexTicker = [
  MARKET: string,
  BID: number,
  BID_SIZE: number,
  ASK: number,
  ASK_SIZE: number,
  DAILY_CHANGE: number,
  DAILY_CHANGE_RELATIVE: number,
  LAST_PRICE: number,
  VOLUME: number,
  HIGH: number,
  LOW: number,
]
