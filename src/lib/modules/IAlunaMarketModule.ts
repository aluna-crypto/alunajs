import { IAlunaMarketSchema } from '../schemas/IAlunaMarketSchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../schemas/IAlunaModuleSchema'



export interface IAlunaMarketModule {

  /* eslint-disable max-len */

  list (params: IAlunaMarketListParams): Promise<IAlunaMarketListReturns>
  listRaw (params: IAlunaMarketListParams): Promise<IAlunaMarketListRawReturns>

  get? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetReturns>
  getRaw? (params: IAlunaMarketGetParams): Promise<IAlunaMarketGetRawReturns>

  parse (params: IAlunaMarketParseParams): Promise<IAlunaMarketParseReturns>
  parseMany (params: IAlunaMarketParseManyParams): Promise<IAlunaMarketParseManyReturns>

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaMarketParseParams <T = any> extends IAlunaModuleParams {
  rawMarket: T
}

export interface IAlunaMarketParseReturns extends IAlunaModuleReturns {
  market: IAlunaMarketSchema
}



export interface IAlunaMarketParseManyParams <T = any> extends IAlunaModuleParams {
  rawMarkets: T[]
}

export interface IAlunaMarketParseManyReturns extends IAlunaModuleReturns {
  markets: IAlunaMarketSchema[]
}



/**
 * List
 */

export interface IAlunaMarketListParams extends IAlunaModuleParams {}

export interface IAlunaMarketListRawReturns<T = any> extends IAlunaModuleReturns {
  rawMarkets: T[]
}

export interface IAlunaMarketListReturns extends IAlunaModuleReturns {
  markets: IAlunaMarketSchema[]
}



/**
 * Get
 */

export interface IAlunaMarketGetParams extends IAlunaModuleParams {
  id: string
}

export interface IAlunaMarketGetRawReturns <T = any> extends IAlunaModuleReturns {
  rawMarket: T
}

export interface IAlunaMarketGetReturns extends IAlunaModuleReturns {
  market: IAlunaMarketSchema
}
