import { IAlunaModule } from '@lib/abstracts/IAlunaModule'
import { OrderTypesEnum } from '@lib/enums/OrderTypeEnum'
import { SideEnum } from '@lib/enums/SideEnum'

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
  side: SideEnum
  symbolPair: string
  rate: string | number
  amount: string | number
  type: OrderTypesEnum
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
