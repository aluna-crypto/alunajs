import { AlunaAccountEnum } from '../../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../enums/AlunaOrderTypesEnum'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'
import { IAlunaOrderSchema } from '../../schemas/IAlunaOrderSchema'



export interface IAlunaOrderReadModule {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaOrderListParams): Promise<IAlunaOrderListRawReturns>
  list (params?: IAlunaOrderListParams): Promise<IAlunaOrderListReturns>

  getRaw (params: IAlunaOrderGetParams): Promise<IAlunaOrderGetRawReturns>
  get (params: IAlunaOrderGetParams): Promise<IAlunaOrderGetReturns>

  parseMany (params: IAlunaOrderParseManyParams): IAlunaOrderParseManyReturns
  parse (params: IAlunaOrderParseParams): IAlunaOrderParseReturns

  /* eslint-enable max-len */

}



export interface IAlunaOrderWriteModule extends IAlunaOrderReadModule {

  place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderPlaceReturns>
  edit (params: IAlunaOrderEditParams): Promise<IAlunaOrderEditReturns>
  cancel (params: IAlunaOrderCancelParams): Promise<IAlunaOrderCancelReturns>

}



/**
 * Parse
 */

export interface IAlunaOrderParseParams <T = any> {
  rawOrder: T
}

export interface IAlunaOrderParseReturns {
  order: IAlunaOrderSchema
}



export interface IAlunaOrderParseManyParams <T = any> {
  rawOrders: T[]
}

export interface IAlunaOrderParseManyReturns {
  orders: IAlunaOrderSchema[]
}



/**
 * List
 */

export interface IAlunaOrderListParams extends IAlunaModuleParams {
  openOrdersOnly?: boolean
}

export interface IAlunaOrderListRawReturns <T = any> extends IAlunaModuleReturns {
  rawOrders: T[]
}

export interface IAlunaOrderListReturns extends IAlunaOrderParseManyReturns, IAlunaModuleReturns {}



/**
 * Get
 */

export interface IAlunaOrderGetParams extends IAlunaModuleParams {
  id: string
  symbolPair: string
}

export interface IAlunaOrderGetRawReturns <T = any> extends IAlunaModuleReturns {
  rawOrder: T
}

export interface IAlunaOrderGetReturns extends IAlunaOrderParseReturns, IAlunaModuleReturns {}



/**
 * Place
 */

export interface IAlunaOrderPlaceParams extends IAlunaModuleParams {
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



/**
 * Cancel
 */

export interface IAlunaOrderCancelParams extends IAlunaOrderGetParams {}

export interface IAlunaOrderCancelReturns extends IAlunaOrderGetReturns {}
