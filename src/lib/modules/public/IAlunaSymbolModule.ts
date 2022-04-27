import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'
import { IAlunaSymbolSchema } from '../../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaSymbolListParams): Promise<IAlunaSymbolListRawReturns<any>>
  list (params?: IAlunaSymbolListParams): Promise<IAlunaSymbolListReturns>

  getRaw? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetRawReturns<any>>
  get? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetReturns>

  parseMany (params: IAlunaSymbolParseManyParams<any>): IAlunaSymbolParseManyReturns
  parse (params: IAlunaSymbolParseParams<any>): IAlunaSymbolParseReturns

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaSymbolParseParams <T> {
  rawSymbol: T
}

export interface IAlunaSymbolParseReturns {
  symbol: IAlunaSymbolSchema
}



export interface IAlunaSymbolParseManyParams <T> {
  rawSymbols: T
}

export interface IAlunaSymbolParseManyReturns {
  symbols: IAlunaSymbolSchema[]
}



/**
 * List
 */

export interface IAlunaSymbolListParams extends IAlunaModuleParams {}

export interface IAlunaSymbolListRawReturns<T> extends IAlunaModuleReturns {
  rawSymbols: T
}

export interface IAlunaSymbolListReturns extends IAlunaModuleReturns, IAlunaSymbolParseManyReturns {}



/**
 * Get
 */

export interface IAlunaSymbolGetParams extends IAlunaModuleParams {
  id: string
}

export interface IAlunaSymbolGetRawReturns <T> extends IAlunaModuleReturns {
  rawSymbol: T
}

export interface IAlunaSymbolGetReturns extends IAlunaModuleReturns, IAlunaSymbolParseReturns {}
