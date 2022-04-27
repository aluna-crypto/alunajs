import { IAlunaMarketSchema } from '../../schemas/IAlunaMarketSchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'



export interface IAlunaMarketModule <T> {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaMarketListParams): Promise<IAlunaMarketListRawReturns<T>>
  list (params?: IAlunaMarketListParams): Promise<IAlunaMarketListReturns>

  getRaw? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetRawReturns<T>>
  get? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetReturns>

  parseMany (params: IAlunaMarketParseManyParams<T>): IAlunaMarketParseManyReturns
  parse (params: IAlunaMarketParseParams<T>): IAlunaMarketParseReturns

  /* eslint-enable max-len */

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
  id: string
}

export interface IAlunaMarketGetRawReturns <T> extends IAlunaModuleReturns {
  rawMarket: T
}

export interface IAlunaMarketGetReturns extends IAlunaMarketParseReturns {}
