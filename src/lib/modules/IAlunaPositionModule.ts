import { IAlunaModule } from '../core/IAlunaModule'
import { IAlunaPositionSchema } from '../schemas/IAlunaPositionSchema'



export interface IAlunaPositionListParams {
  openPositionsOnly?: boolean
}

export interface IAlunaPositionGetParams {
  id?: string
  symbolPair?: string
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

  parse (params: { rawPosition: any }): Promise<IAlunaPositionSchema>
  parseMany (params: { rawPositions: any[] }): Promise<IAlunaPositionSchema[]>

  getLeverage? (params: IAlunaPositionGetLeverageParams): Promise<number>
  setLeverage? (params: IAlunaPositionSetLeverageParams): Promise<number>

}
