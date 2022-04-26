import {
  IModuleParams,
  IModuleReturns,
} from '../schemas/IAlunaModuleSchema'
import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {

  listRaw (params: IAlunaSymbolListParams): Promise<IAlunaSymbolListRawReturns>
  list (params: IAlunaSymbolListParams): Promise<IAlunaSymbolListReturns>

  getRaw? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetRawReturns>
  get? (params: IAlunaSymbolGetParams): Promise<IAlunaSymbolGetReturns>

  parseMany (params: IAlunaSymbolParseManyParams): IAlunaSymbolParseManyReturns
  parse (params: IAlunaSymbolParseParams): IAlunaSymbolParseReturns

}



/**
 * Parse
 */

export interface IAlunaSymbolParseParams {
  rawSymbol: any
}

export interface IAlunaSymbolParseReturns {
  symbol: IAlunaSymbolSchema
}



export interface IAlunaSymbolParseManyParams {
  rawSymbols: any[]
}

export interface IAlunaSymbolParseManyReturns {
  symbols: IAlunaSymbolSchema[]
}



/**
 * List
 */

export interface IAlunaSymbolListParams extends IModuleParams {}

export interface IAlunaSymbolListRawReturns<T = any> extends IModuleReturns {
  rawSymbols: T[]
}

export interface IAlunaSymbolListReturns extends IModuleReturns {
  symbols: IAlunaSymbolSchema[]
}



/**
 * Get
 */

export interface IAlunaSymbolGetParams extends IModuleParams {
  id: string
}

export interface IAlunaSymbolGetRawReturns <T = any> extends IModuleReturns {
  rawSymbol: T
}

export interface IAlunaSymbolGetReturns extends IModuleReturns {
  symbol: IAlunaSymbolSchema
}
