import { IAlunaModule } from '../core/IAlunaModule'
import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../enums/AlunaSideEnum'
import { IAlunaOrderSchema } from '../schemas/IAlunaOrderSchema'



export interface IAlunaOrderListParams {
  openOrdersOnly: boolean
  // start?: number
  // limit?: number
}

export interface IAlunaOrderGetParams {
  id: string | number
  symbolPair: string
}

export interface IAlunaOrderPlaceParams {
  account: AlunaAccountEnum
  type: AlunaOrderTypesEnum
  side: AlunaSideEnum
  symbolPair: string
  rate: string | number | undefined // TODO: validate tests that skips rate
  amount: string | number
}



export interface IAlunaOrderCancelParams extends IAlunaOrderGetParams {}



export interface IAlunaOrderReadModule extends IAlunaModule {

  list (params?: IAlunaOrderListParams): Promise<IAlunaOrderSchema[]>
  listRaw (params?: IAlunaOrderListParams): Promise<any[]>

  get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema>
  getRaw (params: IAlunaOrderGetParams): Promise<any>

  parse (params: { rawOrder: any }): IAlunaOrderSchema
  parseMany (parms: { rawOrders: any[] }): IAlunaOrderSchema[]

}



export interface IAlunaOrderWriteModule extends IAlunaOrderReadModule {
  place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema>
  cancel (params: IAlunaOrderCancelParams): Promise<IAlunaOrderSchema>
}
