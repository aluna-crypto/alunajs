import { IAlunaApiRequestSchema } from '../schemas/IAlunaApiRequestSchema'
import { IAlunaPositionSchema } from '../schemas/IAlunaPositionSchema'



export interface IAlunaPositionModule {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaPositionListParams): Promise<IAlunaPositionListRawReturns>
  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionListReturns>
  getRaw (params: IAlunaPositionGetParams): Promise<IAlunaPositionGetRawReturns>
  get (params: IAlunaPositionGetParams): Promise<IAlunaPositionGetReturns>
  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionCloseReturns>
  parse (params: IAlunaPositionParseParams): Promise<IAlunaPositionParseReturns>
  parseMany (params: IAlunaPositionParseManyParams): Promise<IAlunaPositionParseManyReturns>
  getLeverage? (params: IAlunaPositionGetLeverageParams): Promise<IAlunaPositionGetLeverageReturns>
  setLeverage? (params: IAlunaPositionSetLeverageParams): Promise<IAlunaPositionSetLeverageReturns>

  /* eslint-enable max-len */

}



/**
 * Parse
 */
export interface IAlunaPositionParseParams {
  rawPosition: any
}

export interface IAlunaPositionParseReturns extends IAlunaApiRequestSchema {
  position: IAlunaPositionSchema
}



export interface IAlunaPositionParseManyParams {
  rawPositions: any[]
}

export interface IAlunaPositionParseManyReturns extends IAlunaApiRequestSchema {
  positions: IAlunaPositionSchema[]
}



/**
 * List
 */
export interface IAlunaPositionListParams {
  openPositionsOnly?: boolean
}

export interface IAlunaPositionListRawReturns extends IAlunaApiRequestSchema {
  rawPositions: any[]
}

export interface IAlunaPositionListReturns extends IAlunaPositionParseManyReturns {}



/**
 * Get
 */

export interface IAlunaPositionGetParams {
  id?: string
  symbolPair?: string
}

export interface IAlunaPositionGetRawReturns extends IAlunaApiRequestSchema {
  rawPosition: any
}

export interface IAlunaPositionGetReturns extends IAlunaApiRequestSchema {
  position: IAlunaPositionSchema
}



/**
 * Close
 */

export interface IAlunaPositionCloseParams {
  id?: string
  symbolPair?: string
}

export interface IAlunaPositionCloseReturns extends IAlunaApiRequestSchema {
  position: IAlunaPositionSchema
}



/**
 * Leverage
 */

export interface IAlunaPositionGetLeverageParams {
  symbolPair: string
}

export interface IAlunaPositionGetLeverageReturns extends IAlunaApiRequestSchema {
  leverage: number
}



export interface IAlunaPositionSetLeverageParams {
  symbolPair: string
  leverage: number
}

export interface IAlunaPositionSetLeverageReturns extends IAlunaApiRequestSchema {
  leverage: number
}
