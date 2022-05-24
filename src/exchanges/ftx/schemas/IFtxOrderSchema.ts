import { FtxOrderSideEnum } from '../enums/FtxOrderSideEnum'
import { FtxOrderStatusEnum } from '../enums/FtxOrderStatusEnum'
import { FtxOrderTypeEnum } from '../enums/FtxOrderTypeEnum'



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
