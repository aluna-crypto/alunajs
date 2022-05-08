import { ValrOrderTimeInForceEnum } from '../enums/ValrOderTimeInForceEnum'
import { ValrOrderSideEnum } from '../enums/ValrOrderSideEnum'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTypeEnum } from '../enums/ValrOrderTypeEnum'
import { IValrMarketCurrencyPairs } from './IValrMarketSchema'



export interface IValrOrderSchema {
  order: IValrOrderGetSchema | IValrOrderListSchema
  pair: IValrMarketCurrencyPairs
}

export interface IValrOrderGetResponseSchema {
  order: IValrOrderGetSchema
  pair: IValrMarketCurrencyPairs
}

export interface IValrOrderListResponseSchema {
  orders: IValrOrderListSchema[]
  pairs: IValrMarketCurrencyPairs[]
}

export interface IValrOrderPlaceResponseSchema {
  id: string
}

export interface IValrOrderGetSchema {
  orderId: string
  orderStatusType: ValrOrderStatusEnum
  currencyPair: string
  originalPrice: string
  remainingQuantity: string
  originalQuantity: string
  orderSide: ValrOrderSideEnum
  orderType: ValrOrderTypeEnum
  failedReason: string
  stopPrice?: string // only available for STOP-LOSS_LIMIT and TAKE-PROFIT-LIMIT
  customerOrderId?: string // only available if it was informed at place order
  orderUpdatedAt: string
  orderCreatedAt: string
  timeInForce: ValrOrderTimeInForceEnum
}

export interface IValrOrderListSchema {
  orderId: string
  side: ValrOrderSideEnum
  remainingQuantity: string
  price: string
  currencyPair: string
  createdAt: string
  originalQuantity: string
  filledPercentage: string
  stopPrice?: string // only available for STOP-LOSS_LIMIT and TAKE-PROFIT-LIMIT
  customerOrderId?: string // only available if it was informed at place order
  updatedAt: string
  status: ValrOrderStatusEnum
  type: ValrOrderTypeEnum
  timeInForce: ValrOrderTimeInForceEnum
}
