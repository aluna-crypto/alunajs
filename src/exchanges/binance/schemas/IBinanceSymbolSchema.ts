export interface IBinanceSymbolInfoSchema {
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
  filters: {
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
  }[]
  permissions: string[]
}

export interface IBinanceSymbolSchema {
  timezone: string
  serverTime: number
  rateLimits: {
    rateLimitType: string
    interval: string
    intervalNum: number
    limit: number
  }[]
  exchangeFilters: {
    filterType: string
    maxNumOrders: number
  }[]
  symbols: IBinanceSymbolInfoSchema[]
}
