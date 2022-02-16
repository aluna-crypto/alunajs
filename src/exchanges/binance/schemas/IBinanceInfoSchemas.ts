import { IBinanceSymbolSchema } from './IBinanceSymbolSchema'



export interface IBinanceInfoSchema {
  timezone: string
  serverTime: number
  rateLimits: IBinanceRateLimits[]
  exchangeFilters: IBinanceExchangeFilters[]
  symbols: IBinanceSymbolSchema[]
}



export interface IBinanceRateLimits {
  rateLimitType: string
  interval: string
  intervalNum: number
  limit: number
}



export interface IBinanceExchangeFilters {
  filterType: string
  maxNumOrders: number
}
