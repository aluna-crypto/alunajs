import { IAlunaApiRequestSchema } from '../schemas/IAlunaApiRequestSchema'
import { IAlunaMarketSchema } from '../schemas/IAlunaMarketSchema'



export interface IAlunaMarketModule {

  list (): Promise<IAlunaMarketListReturns>
  listRaw (): Promise<IAlunaMarketListRawReturns>

  get? (params: IAlunaMarketGetParams): IAlunaMarketGetReturns
  getRaw? (params: IAlunaMarketGetParams): IAlunaMarketGetRawReturns

  parse (params: IAlunaMarketParseParams): IAlunaMarketParseReturns
  parseMany (params: IAlunaMarketParseManyParams): IAlunaMarketParseManyReturns

}



/**
 * Parse
 */

export interface IAlunaMarketParseParams {
  rawMarket: any
}

export interface IAlunaMarketParseReturns extends IAlunaApiRequestSchema {
  market: IAlunaMarketSchema
}



export interface IAlunaMarketParseManyParams {
  rawMarkets: any[]
}

export interface IAlunaMarketParseManyReturns extends IAlunaApiRequestSchema {
  markets: IAlunaMarketSchema[]
}



/**
 * List
 */

export interface IAlunaMarketListRawReturns extends IAlunaApiRequestSchema {
  rawMarkets: any[]

}
export interface IAlunaMarketListReturns extends IAlunaApiRequestSchema {
  markets: IAlunaMarketSchema[]
}



/**
 * Get
 */

export interface IAlunaMarketGetParams {
  id: string
}

export interface IAlunaMarketGetRawReturns extends IAlunaApiRequestSchema {
  rawMarket: any
}

export interface IAlunaMarketGetReturns extends IAlunaApiRequestSchema {
  market: IAlunaMarketSchema
}
