import { AccountEnum } from '../enums/AccountEnum'
import { OrderStatusEnum } from '../enums/OrderStatusEnum'
import { OrderTypesEnum } from '../enums/OrderTypeEnum'
import { SideEnum } from '../enums/SideEnum'



export interface IAlunaOrderSchema {

  id: string | number

  marketId: string

  total: number
  amount: number
  isAmountInContracts: boolean

  rate?: number
  stopRate?: number
  limitRate?: number

  account: AccountEnum
  side: SideEnum
  status: OrderStatusEnum
  type: OrderTypesEnum

  placedAt: Date
  filledAt?: Date
  canceledAt?: Date

}
