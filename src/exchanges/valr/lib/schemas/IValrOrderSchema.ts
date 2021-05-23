import {
  ValrOrderStatusEnum,
} from '../enums/ValrOrderStatusEnum'
import {
  ValrOrderTimeInForceEnum,
} from '../enums/ValrOrderTimeInForceEnum'
import {
  ValrOrderTypesEnum,
} from '../enums/ValrOrderTypesEnum'
import {
  ValrSideEnum,
} from '../enums/ValrSideEnum'


/**
 * ISSUE: Valr has many different order responses types
*/

export interface IValrPlaceOrderSchema {
  side: ValrSideEnum
  quantity: string
  price: string
  pair: string
  postOnly: boolean
  customerOrderId: string
  timeInForce: ValrOrderTimeInForceEnum
}



export interface IValrOrderSchema {
  orderId: string
  side: ValrSideEnum
  remainingQuantity: string
  price: string
  currencyPair: string
  createdAt: string
  originalQuantity: string
  filledPercentage: string
  stopPrice: string
  updatedAt: string
  status: ValrOrderStatusEnum
  type: ValrOrderTypesEnum
  timeInForce: ValrOrderTimeInForceEnum
}



export interface IValrOrderStatusSchema {
  orderId: string
  orderStatusType: ValrOrderTypesEnum
  currencyPair: string
  originalPrice: string
  remainingQuantity: string
  originalQuantity: string
  orderSide: ValrSideEnum
  orderType: ValrOrderTypesEnum
  failedReason: string
  customerOrderId: string
  orderUpdatedAt: Date
  orderCreatedAt: Date
}



export interface IValrOderHistorySchema {
  orderId: string
  customerOrderId: string
  orderStatusType: ValrOrderTypesEnum
  currencyPair: string
  averagePrice: string
  originalPrice: string
  remainingQuantity: string
  originalQuantity: string
  total: string
  totalFee: string
  feeCurrency: string
  orderSide: ValrSideEnum
  orderType: ValrOrderTypesEnum
  failedReason: string
  orderUpdatedAt: Date
  orderCreatedAt: Date
  timeInForce: ValrOrderTimeInForceEnum
}
