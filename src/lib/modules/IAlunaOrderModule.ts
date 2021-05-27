import {
  IValrOrderSchema,
} from 'src/exchanges/valr/lib/schemas/IValrOrderSchema'

import { IAlunaModule } from '@lib/abstracts/IAlunaModule'
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
  // TODO: to be continued...
}



export interface IAlunaOrderModule extends IAlunaModule {

  list (params?: IAlunaOrderListParams): Promise<IAlunaOrderSchema[]>
  listRaw (params?: IAlunaOrderListParams): Promise<IValrOrderSchema[]>
  get? (params?: IAlunaOrderGetParams): Promise<IAlunaOrderSchema>
  place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema>
  parse (params: { rawOrder: any }): IAlunaOrderSchema
  parseMany (parms: { rawOrders: any[] }): IAlunaOrderSchema[]

}
