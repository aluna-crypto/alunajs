import { IAlunaApiRequestSchema } from '../schemas/IAlunaApiRequestSchema'
import { IAlunaSymbolSchema } from '../schemas/IAlunaSymbolSchema'



export interface IAlunaSymbolModule {


  listRaw (): Promise<IAlunaSymbolListRawReturns>
  list (): Promise<IAlunaSymbolListReturns>

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

export interface IAlunaSymbolParseReturns extends IAlunaApiRequestSchema {
  symbol: IAlunaSymbolSchema
}



export interface IAlunaSymbolParseManyParams {
  rawSymbols: any[]
}

export interface IAlunaSymbolParseManyReturns extends IAlunaApiRequestSchema {
  symbols: IAlunaSymbolSchema[]
}



/**
 * List
 */

export interface IAlunaSymbolListRawReturns<T = any> extends IAlunaApiRequestSchema {
  rawSymbols: T[]
}
export interface IAlunaSymbolListReturns extends IAlunaApiRequestSchema {
  symbols: IAlunaSymbolSchema[]
}



/**
 * Get
 */

export interface IAlunaSymbolGetParams {
  id: string
}

export interface IAlunaSymbolGetRawReturns extends IAlunaApiRequestSchema {
  rawSymbol: any
}

export interface IAlunaSymbolGetReturns extends IAlunaApiRequestSchema {
  symbol: IAlunaSymbolSchema
}
