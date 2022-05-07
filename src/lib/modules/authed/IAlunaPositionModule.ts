import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'
import { IAlunaPositionSchema } from '../../schemas/IAlunaPositionSchema'



export interface IAlunaPositionModule {

  listRaw (params?: IAlunaPositionListParams): Promise<IAlunaPositionListRawReturns<any>>
  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionListReturns>

  getRaw (params: IAlunaPositionGetParams): Promise<IAlunaPositionGetRawReturns<any>>
  get (params: IAlunaPositionGetParams): Promise<IAlunaPositionGetReturns>

  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionCloseReturns>

  parseMany (params: IAlunaPositionParseManyParams<any>): IAlunaPositionParseManyReturns
  parse (params: IAlunaPositionParseParams<any>): IAlunaPositionParseReturns

  getLeverage? (params: IAlunaPositionGetLeverageParams): Promise<IAlunaPositionGetLeverageReturns>
  setLeverage? (params: IAlunaPositionSetLeverageParams): Promise<IAlunaPositionSetLeverageReturns>

}



/**
 * Parse
 */
export interface IAlunaPositionParseParams <T> extends IAlunaModuleParams {
  rawPosition: T
}

export interface IAlunaPositionParseReturns {
  position: IAlunaPositionSchema
}



export interface IAlunaPositionParseManyParams <T> extends IAlunaModuleParams {
  rawPositions: T[]
}

export interface IAlunaPositionParseManyReturns {
  positions: IAlunaPositionSchema[]
}



/**
 * List
 */
export interface IAlunaPositionListParams extends IAlunaModuleParams {
  openPositionsOnly?: boolean
}

export interface IAlunaPositionListRawReturns <T> extends IAlunaModuleReturns {
  rawPositions: T
}

export interface IAlunaPositionListReturns extends IAlunaPositionParseManyReturns, IAlunaModuleReturns {}



/**
 * Get
 */

export interface IAlunaPositionGetParams extends IAlunaModuleParams {
  id?: string
  symbolPair?: string
}

export interface IAlunaPositionGetRawReturns <T> extends IAlunaModuleReturns {
  rawPosition: T
}

export interface IAlunaPositionGetReturns extends IAlunaPositionParseReturns, IAlunaModuleReturns {}



/**
 * Close
 */

export interface IAlunaPositionCloseParams extends IAlunaModuleParams {
  id?: string
  symbolPair?: string
}

export interface IAlunaPositionCloseReturns extends IAlunaPositionGetReturns {}



/**
 * Leverage
 */

export interface IAlunaPositionGetLeverageParams extends IAlunaModuleParams {
  id?: string
  symbolPair: string
}

export interface IAlunaPositionGetLeverageReturns extends IAlunaModuleReturns {
  leverage: number
}



export interface IAlunaPositionSetLeverageParams extends IAlunaModuleParams {
  symbolPair: string
  leverage: number
}

export interface IAlunaPositionSetLeverageReturns extends IAlunaModuleReturns {
  leverage: number
}
