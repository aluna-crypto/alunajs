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

  parseMany (params: IAlunaOrderParseManyParams): Promise<IAlunaOrderParseManyReturns>
  parse (params: IAlunaOrderParseParams): Promise<IAlunaOrderParseReturns>

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

export interface IAlunaOrderParseParams <T = any> extends IAlunaModuleParams {
  rawOrder: T
}

export interface IAlunaOrderParseReturns extends IAlunaModuleReturns {
  order: IAlunaOrderSchema
}



export interface IAlunaOrderParseManyParams <T = any> extends IAlunaModuleParams {
  rawOrders: T[]
}

export interface IAlunaOrderParseManyReturns extends IAlunaModuleReturns {
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

export interface IAlunaOrderListReturns extends IAlunaOrderParseManyReturns {}



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

export interface IAlunaOrderGetReturns extends IAlunaOrderParseReturns {}



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
