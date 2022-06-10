export interface IBitfinexMarketsSchema {
  tickers: IBitfinexTicker[]
  enabledMarginCurrencies: string[][]
  pairsInfo: TBitfinexPairInfo[]
}


export interface IBitfinexMarketSchema {
  ticker: IBitfinexTicker
  enabledMarginCurrency: string | undefined
  pairInfo: TBitfinexPairInfo
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



export type TBitfinexPairInfo = [
  MARKET: string,
  MARKET_INFO: [
    PLACEHOLDER: null,
    PLACEHOLDER: null,
    PLACEHOLDER: null,
    MIN_TRADE_AMOUNT: string,
    MAX_TRADE_AMOUNT: string,
    PLACEHOLDER: null,
    PLACEHOLDER: null,
    PLACEHOLDER: null,
    INITIAL_MARGIN: number,
    MIN_MARGIN: number,
    PLACEHOLDER: null,
    PLACEHOLDER: null,
  ]
]
