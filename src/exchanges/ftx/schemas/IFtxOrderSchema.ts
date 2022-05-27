import { FtxOrderSideEnum } from '../enums/FtxOrderSideEnum'
import { FtxOrderStatusEnum } from '../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'
import { FtxTriggerOrderTypeEnum } from '../enums/FtxTriggerOrderTypeEnum'



export interface IFtxOrderSchema {
  createdAt: string
  filledSize: number
  future: string
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
  future: string
  id: number
  market: string
  price: number | null
  avgFillPrice: number | null
  remainingSize: number
  side: FtxOrderSideEnum
  size: number
  status: FtxOrderStatusEnum
  type: FtxTriggerOrderTypeEnum
  reduceOnly: boolean
  ioc: boolean
  postOnly: boolean
  clientId: number
  orderPrice: number | null
  trailStart: number | null
  trailValue: number | null
  triggerPrice: number
  triggeredAt: string | null
  cancelledAt: string | null
  orderType: FtxOrderTypeEnum
  retryUntilFilled: boolean
}
