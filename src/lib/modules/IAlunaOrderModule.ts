import { IAlunaModule } from '../core/IAlunaModule'
import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { IAlunaApiRequestSchema } from '../schemas/IAlunaApiRequestSchema'
import { IAlunaOrderSchema } from '../schemas/IAlunaOrderSchema'



export interface IAlunaOrderReadModule extends IAlunaModule {

  listRaw (params?: IAlunaOrderListParams): Promise<IAlunaOrderListRawReturns>
  list (params?: IAlunaOrderListParams): Promise<IAlunaOrderListReturns>
  getRaw (params: IAlunaOrderGetParams): Promise<IAlunaOrderGetRawReturns>
  get (params: IAlunaOrderGetParams): Promise<IAlunaOrderGetReturns>
  parseMany (params: IAlunaOrderParseManyParams)
    : Promise<IAlunaOrderParseManyReturns>
  parse (params: IAlunaOrderParseParams): Promise<IAlunaOrderParseReturns>

}



export interface IAlunaOrderWriteModule extends IAlunaOrderReadModule {

  place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderPlaceReturns>
  edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderEditReturns>
  cancel (params: IAlunaOrderGetParams): Promise<IAlunaOrderGetReturns>

}



/**
 * Parse
 */

export interface IAlunaOrderParseParams {
  rawOrder: any
}

export interface IAlunaOrderParseReturns extends IAlunaApiRequestSchema {
  order: IAlunaOrderSchema
}



export interface IAlunaOrderParseManyParams {
  rawOrders: any[]
}

export interface IAlunaOrderParseManyReturns extends IAlunaApiRequestSchema {
  orders: IAlunaOrderSchema[]
}



/**
 * List
 */

export interface IAlunaOrderListParams {
  openOrdersOnly: boolean
}

export interface IAlunaOrderListRawReturns<T = any> extends IAlunaApiRequestSchema {
  rawOrders: T[]
}

export interface IAlunaOrderListReturns extends IAlunaOrderParseManyReturns {}



/**
 * Get
 */

export interface IAlunaOrderGetParams {
  id: string
  symbolPair: string
}

export interface IAlunaOrderGetRawReturns extends IAlunaApiRequestSchema {
  rawOrder: any
}

export interface IAlunaOrderGetReturns extends IAlunaApiRequestSchema {
  order: IAlunaOrderSchema
}



/**
 * Place
 */

export interface IAlunaOrderPlaceParams {
  account: AlunaAccountEnum
  type: AlunaOrderTypesEnum
  side: AlunaOrderSideEnum
  symbolPair: string
  rate?: number
  limitRate?: number
  stopRate?: number
  amount: number
}

export interface IAlunaOrderPlaceReturns extends IAlunaOrderGetReturns {}



/**
 * Edit
 */

export interface IAlunaOrderEditParams extends IAlunaOrderPlaceParams {
  id: string
}

export interface IAlunaOrderEditReturns extends IAlunaOrderGetReturns {}
