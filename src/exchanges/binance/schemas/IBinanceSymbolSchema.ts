export interface IBinanceFilters {
  filterType: string
  minPrice?: string
  maxPrice?: string
  tickSize?: string
  minQty?: string
  maxQty?: string
  stepSize?: string
  limit?: number
  minNotional?: string
  applyToMarket?: boolean
  avgPriceMins?: number
  multiplierUp?: string
  multiplierDown?: string
  maxNumOrders?: number
  maxNumAlgoOrders?: number
}

export interface IBinanceSymbolSchema {
  symbol: string
  status: string
  baseAsset: string
  baseAssetPrecision: number
  quoteAsset: string
  quotePrecision: number
  quoteAssetPrecision: number
  baseCommissionPrecision: number
  quoteCommissionPrecision: number
  orderTypes: string[]
  icebergAllowed: boolean
  ocoAllowed: boolean
  quoteOrderQtyMarketAllowed: boolean
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  filters: IBinanceFilters[]
  permissions: string[]
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


export interface IBinanceInfoSchema {
  timezone: string
  serverTime: number
  rateLimits: IBinanceRateLimits[]
  exchangeFilters: IBinanceExchangeFilters[]
  symbols: IBinanceSymbolSchema[]
}
