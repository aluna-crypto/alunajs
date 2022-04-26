import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'
import { IAlunaSymbolSchema } from '../../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaSymbolListParams): Promise<IAlunaSymbolListRawReturns>
  list (params?: IAlunaSymbolListParams): Promise<IAlunaSymbolListReturns>

  getRaw? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetRawReturns>
  get? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetReturns>

  parseMany (params: IAlunaSymbolParseManyParams): Promise<IAlunaSymbolParseManyReturns>
  parse (params: IAlunaSymbolParseParams): Promise<IAlunaSymbolParseReturns>

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaSymbolParseParams <T = any> extends IAlunaModuleParams {
  rawSymbol: T
}

export interface IAlunaSymbolParseReturns extends IAlunaModuleReturns {
  symbol: IAlunaSymbolSchema
}



export interface IAlunaSymbolParseManyParams <T = any> extends IAlunaModuleParams {
  rawSymbols: T[]
}

export interface IAlunaSymbolParseManyReturns extends IAlunaModuleReturns {
  symbols: IAlunaSymbolSchema[]
}



/**
 * List
 */

export interface IAlunaSymbolListParams extends IAlunaModuleParams {}

export interface IAlunaSymbolListRawReturns<T = any> extends IAlunaModuleReturns {
  rawSymbols: T[]
}

export interface IAlunaSymbolListReturns extends IAlunaSymbolParseManyReturns {}



/**
 * Get
 */

export interface IAlunaSymbolGetParams extends IAlunaModuleParams {
  id: string
}

export interface IAlunaSymbolGetRawReturns <T = any> extends IAlunaModuleReturns {
  rawSymbol: T
}

export interface IAlunaSymbolGetReturns extends IAlunaSymbolParseReturns {}
