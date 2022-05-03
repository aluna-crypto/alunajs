import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'
import { IAlunaPositionSchema } from '../../schemas/IAlunaPositionSchema'



export interface IAlunaPositionModule {

  listRaw (params?: IAlunaPositionListParams): Promise<IAlunaPositionListRawReturns>
  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionListReturns>

  getRaw (params: IAlunaPositionGetParams): Promise<IAlunaPositionGetRawReturns>
  get (params: IAlunaPositionGetParams): Promise<IAlunaPositionGetReturns>

  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionCloseReturns>

  parseMany (params: IAlunaPositionParseManyParams): Promise<IAlunaPositionParseManyReturns>
  parse (params: IAlunaPositionParseParams): Promise<IAlunaPositionParseReturns>

  getLeverage? (params: IAlunaPositionGetLeverageParams): Promise<IAlunaPositionGetLeverageReturns>
  setLeverage? (params: IAlunaPositionSetLeverageParams): Promise<IAlunaPositionSetLeverageReturns>

}



/**
 * Parse
 */
export interface IAlunaPositionParseParams <T = any> extends IAlunaModuleParams {
  rawPosition: T
}

export interface IAlunaPositionParseReturns extends IAlunaModuleReturns {
  position: IAlunaPositionSchema
}



export interface IAlunaPositionParseManyParams <T = any> extends IAlunaModuleParams {
  rawPositions: T[]
}

export interface IAlunaPositionParseManyReturns extends IAlunaModuleReturns {
  positions: IAlunaPositionSchema[]
}



/**
 * List
 */
export interface IAlunaPositionListParams extends IAlunaModuleParams {
  openPositionsOnly?: boolean
}

export interface IAlunaPositionListRawReturns <T = any> extends IAlunaModuleReturns {
  rawPositions: T[]
}

export interface IAlunaPositionListReturns extends IAlunaPositionParseManyReturns {}



/**
 * Get
 */

export interface IAlunaPositionGetParams extends IAlunaModuleParams {
  id?: string
  symbolPair?: string
}

export interface IAlunaPositionGetRawReturns <T = any> extends IAlunaModuleReturns {
  rawPosition: T
}

export interface IAlunaPositionGetReturns extends IAlunaPositionParseReturns {}



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
