import { IAlunaMarketSchema } from '../schemas/IAlunaMarketSchema'
import {
  IModuleParams,
  IModuleReturns,
} from '../schemas/IAlunaModuleSchema'



export interface IAlunaMarketModule {

  list (params: IAlunaMarketListParams): Promise<IAlunaMarketListReturns>
  listRaw (params: IAlunaMarketListParams): Promise<IAlunaMarketListRawReturns>

  get? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetReturns>
  getRaw? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetRawReturns>

  parse (params: IAlunaMarketParseParams): IAlunaMarketParseReturns
  parseMany (params: IAlunaMarketParseManyParams): IAlunaMarketParseManyReturns

}



/**
 * Parse
 */

export interface IAlunaMarketParseParams<T = any> {
  rawMarket: T
}

export interface IAlunaMarketParseReturns {
  market: IAlunaMarketSchema
}



export interface IAlunaMarketParseManyParams {
  rawMarkets: any[]
}

export interface IAlunaMarketParseManyReturns {
  markets: IAlunaMarketSchema[]
}



/**
 * List
 */

export interface IAlunaMarketListParams extends IModuleParams {}

export interface IAlunaMarketListRawReturns<T = any> extends IModuleReturns {
  rawMarkets: T[]
}

export interface IAlunaMarketListReturns extends IModuleReturns {
  markets: IAlunaMarketSchema[]
}



/**
 * Get
 */

export interface IAlunaMarketGetParams extends IModuleParams {
  id: string
}

export interface IAlunaMarketGetRawReturns <T = any> extends IModuleReturns {
  rawMarket: T
}

export interface IAlunaMarketGetReturns extends IModuleReturns {
  market: IAlunaMarketSchema
}
