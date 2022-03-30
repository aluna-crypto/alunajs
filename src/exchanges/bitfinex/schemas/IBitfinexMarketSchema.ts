export interface IBitfinexMarketSchema extends TBitfinexMarket {}


type TBitfinexMarket = [
  IBitfinexTicker[],
  IBitfinexMarginEnabledCurrencies,
]


export interface IBitfinexTicker extends TBitfinexTicker {}

type TBitfinexTicker = [
  SYMBOL: string,
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


export interface IBitfinexMarginEnabledCurrencies extends Array<string> {}
