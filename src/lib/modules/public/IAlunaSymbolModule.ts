import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'
import { IAlunaSymbolSchema } from '../../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule <T> {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaSymbolListParams): Promise<IAlunaSymbolListRawReturns<T>>
  list (params?: IAlunaSymbolListParams): Promise<IAlunaSymbolListReturns>

  getRaw? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetRawReturns<T>>
  get? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetReturns>

  parseMany (params: IAlunaSymbolParseManyParams<T>): IAlunaSymbolParseManyReturns
  parse (params: IAlunaSymbolParseParams<T>): IAlunaSymbolParseReturns

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

export interface IAlunaSymbolGetReturns extends IAlunaSymbolParseReturns {}
