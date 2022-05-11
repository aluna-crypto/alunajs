import { IAlunaMarketSchema } from '../../schemas/IAlunaMarketSchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'



export interface IAlunaMarketModule {

  listRaw (params?: IAlunaMarketListParams): Promise<IAlunaMarketListRawReturns<any>>
  list (params?: IAlunaMarketListParams): Promise<IAlunaMarketListReturns>

  getRaw? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetRawReturns<any>>
  get? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetReturns>

  parseMany (params: IAlunaMarketParseManyParams<any>): IAlunaMarketParseManyReturns
  parse (params: IAlunaMarketParseParams<any>): IAlunaMarketParseReturns

}



/**
 * Parse
 */

export interface IAlunaMarketParseParams <T> {
  rawMarket: T
}

export interface IAlunaMarketParseReturns {
  market: IAlunaMarketSchema
}



export interface IAlunaMarketParseManyParams <T> {
  rawMarkets: T
}

export interface IAlunaMarketParseManyReturns {
  markets: IAlunaMarketSchema[]
}



/**
 * List
 */

export interface IAlunaMarketListParams extends IAlunaModuleParams {}

export interface IAlunaMarketListRawReturns <T> extends IAlunaModuleReturns {
  rawMarkets: T
}

export interface IAlunaMarketListReturns extends IAlunaModuleReturns, IAlunaMarketParseManyReturns {}



/**
 * Get
 */

export interface IAlunaMarketGetParams extends IAlunaModuleParams {
  symbolPair: string
}

export interface IAlunaMarketGetRawReturns <T> extends IAlunaModuleReturns {
  rawMarket: T
}

export interface IAlunaMarketGetReturns extends IAlunaModuleReturns, IAlunaMarketParseReturns {}
