import { IAlunaModule } from '../core/IAlunaModule'
import { IAlunaPositionSchema } from '../schemas/IAlunaPositionSchema'



export interface IAlunaPositionListParams {
  openPositionsOnly?: boolean
}

export interface IAlunaPositionGetParams {
  id: string
}

export interface IAlunaPositionCloseParams {
  id?: string | number
  symbolPair?: string
}

export interface IAlunaPositionModule extends IAlunaModule {

  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionSchema[]>
  listRaw (params?: IAlunaPositionListParams): Promise<any[]>

  get (params: IAlunaPositionGetParams): Promise<IAlunaPositionSchema>
  getRaw (params: IAlunaPositionGetParams): Promise<any>

  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionSchema>

  parse (params: { rawPosition: any }): IAlunaPositionSchema
  parseMany (params: { rawPositions: any[] }): IAlunaPositionSchema[]

}
