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
