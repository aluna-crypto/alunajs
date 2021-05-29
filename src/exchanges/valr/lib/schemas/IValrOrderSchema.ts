import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'



/**
 * NOTE: Valr has many different order responses types
*/



export interface IValrOrderListSchema {
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



export interface IValrOrderGetSchema {
  orderId: string
  orderStatusType: ValrOrderStatusEnum
  currencyPair: string
  originalPrice: string
  remainingQuantity: string
  originalQuantity: string
  orderSide: ValrSideEnum
  orderType: ValrOrderTypesEnum
  failedReason: string
  customerOrderId: string
  orderUpdatedAt: string
  orderCreatedAt: string
}



// export interface IValrOrderHistorySchema {
//   orderId: string
//   customerOrderId: string
//   orderStatusType: ValrOrderStatusEnum
//   currencyPair: string
//   averagePrice: string
//   originalPrice: string
//   remainingQuantity: string
//   originalQuantity: string
//   total: string
//   totalFee: string
//   feeCurrency: string
//   orderSide: ValrSideEnum
//   orderType: ValrOrderTypesEnum
//   failedReason: string
//   orderUpdatedAt: string
//   orderCreatedAt: string
//   timeInForce: ValrOrderTimeInForceEnum
// }
