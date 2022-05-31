import { FtxOrderSideEnum } from '../enums/FtxOrderSideEnum'
import { FtxOrderStatusEnum } from '../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'
import { FtxTriggerOrderTypeEnum } from '../enums/FtxTriggerOrderTypeEnum'



export interface IFtxOrderSchema {
  createdAt: string
  filledSize: number
  future: string | null
  id: number
  market: string
  price: number | null
  avgFillPrice: number | null
  remainingSize: number
  side: FtxOrderSideEnum
  size: number
  status: FtxOrderStatusEnum
  type: FtxOrderTypeEnum
  reduceOnly: boolean
  ioc: boolean
  postOnly: boolean
  clientId: number
}



export interface IFtxTriggerOrderSchema {
  createdAt: string
  filledSize: number
  future: string | null
  id: number
  market: string
  price: number | null
  avgFillPrice: number | null
  remainingSize: number | null
  side: FtxOrderSideEnum
  size: number
  status: FtxOrderStatusEnum
  orderId: null // DEPRECATED
  error: null // DEPRECATED
  cancelReason: string | null
  type: FtxTriggerOrderTypeEnum
  reduceOnly: boolean
  ioc: boolean | null
  postOnly: boolean | null
  clientId: number | null
  orderPrice: number | null
  trailStart: number | null
  trailValue: number | null
  triggerPrice: number | null
  triggeredAt: string | null
  cancelledAt: string | null
  orderType: FtxOrderTypeEnum
  retryUntilFilled: boolean
}
