import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTimeInForceEnum } from '../enums/BinanceOrderTimeInForceEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../enums/BinanceSideEnum'



export interface IBinanceOrderSchema {
  symbol: string
  orderId: number
  orderListId: number // Unless OCO, the value will always be -1
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: BinanceOrderStatusEnum
  timeInForce: string
  type: BinanceOrderTypeEnum
  side: BinanceSideEnum
  stopPrice: string
  icebergQty: string
  time: number
  updateTime: number
  isWorking: boolean
  origQuoteOrderQty: string
}

export interface IBinanceOrderRequest {
  side: BinanceSideEnum
  symbol: string
  type: BinanceOrderTypeEnum
  quantity: string | number
  price?: string | number
  timeInForce?: BinanceOrderTimeInForceEnum
}
