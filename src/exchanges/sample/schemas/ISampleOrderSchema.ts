import { SampleOrderStatusEnum } from '../enums/SampleOrderStatusEnum'
import { SampleOrderTimeInForceEnum } from '../enums/SampleOrderTimeInForceEnum'
import { SampleOrderTypeEnum } from '../enums/SampleOrderTypeEnum'
import { SampleSideEnum } from '../enums/SampleSideEnum'



export interface ISampleOrderToCancel {
  type: SampleOrderTypeEnum
  id: string
}



export interface ISampleOrderSchema {
  id: string
  marketSymbol: string
  direction: SampleSideEnum
  type: SampleOrderTypeEnum
  quantity: string
  limit: string
  ceiling: string
  timeInForce: SampleOrderTimeInForceEnum
  clientOrderId: string
  fillQuantity: string
  commission: string
  proceeds: string
  status: SampleOrderStatusEnum
  createdAt: string
  updatedAt: string
  closedAt: string
  orderToCancel: ISampleOrderToCancel
}
