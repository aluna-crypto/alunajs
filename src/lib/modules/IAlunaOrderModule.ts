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
}

export interface IAlunaOrderPlaceParams {
  side: SideEnum
  symbol: string
  rate: string | number
  amount: string | number
  type: OrderTypesEnum
  // TODO: to be continued...
}



export interface IAlunaOrderModule extends IAlunaModule {

  list (params?: IAlunaOrderListParams): Promise<IAlunaOrderSchema[]>
  listRaw (params?: IAlunaOrderListParams): Promise<any[]>
  get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema>
  getRaw (params: IAlunaOrderGetParams): Promise<any>
  place? (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema>
  parse (params: { rawOrder: any }): IAlunaOrderSchema
  parseMany (parms: { rawOrders: any[] }): IAlunaOrderSchema[]

}
