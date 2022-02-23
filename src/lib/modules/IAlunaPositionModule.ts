import { IAlunaModule } from '../core/IAlunaModule'
import { IAlunaPositionSchema } from '../schemas/IAlunaPositionSchema'



export interface IAlunaPositionListParams {
  openPositionsOnly?: boolean
}

export interface IAlunaPositionGetParams {
  id: string
}

export interface IAlunaPositionCloseParams {
  id?: string
  symbolPair?: string
}

export interface IAlunaPositionGetLeverageParams {
  symbolPair: string
}

export interface IAlunaPositionSetLeverageParams {
  symbolPair: string
  leverage: number
}

export interface IAlunaPositionModule extends IAlunaModule {

  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionSchema[]>
  listRaw (params?: IAlunaPositionListParams): Promise<any[]>

  get (params: IAlunaPositionGetParams): Promise<IAlunaPositionSchema>
  getRaw (params: IAlunaPositionGetParams): Promise<any>

  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionSchema>

  parse (params: { rawPosition: any }): IAlunaPositionSchema
  parseMany (params: { rawPositions: any[] }): IAlunaPositionSchema[]

  // TODO: Adjust return type of method `IAlunaPositionSetLeverageParams`
  setLeverage? (params: IAlunaPositionGetLeverageParams): Promise<number>
  getLeverage? (params: IAlunaPositionSetLeverageParams): any
}
