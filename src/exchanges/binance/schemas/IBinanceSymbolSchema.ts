export enum BinanceSymbolStatusEnum {
  PRE_TRADING = 'PRE_TRADING',
  TRADING = 'TRADING',
  POST_TRADING = 'POST_TRADING',
  END_OF_DAY = 'END_OF_DAY',
  HALT = 'HALT',
  AUCTION_MATCH = 'AUCTION_MATCH',
  BREAK = 'BREAK'
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
  filters: IBinanceSymbolFilters[]
  permissions: string[]
}



export interface IBinanceSymbolFilters {
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
