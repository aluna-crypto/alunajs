import { IAlunaPositionSchema } from '../schemas/IAlunaPositionSchema'



export interface IAlunaPositionListParams {
  // openOnly?: boolean
  // start?: nyumber
  // limit?: nyumber
}

export interface IAlunaPositionGetParams {
  id: string
}

export interface IAlunaPositionCloseParams {
  id: string | number
}



export interface IAlunaPosition {

  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionSchema[]>
  get (params?: IAlunaPositionGetParams): Promise<IAlunaPositionSchema>
  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionSchema>
  parse (params: { rawPosition: any }): IAlunaPositionSchema
  parseMany (parms: { rawPositions: any[] }): IAlunaPositionSchema[]

}
