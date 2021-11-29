import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../enums/BinanceSideEnum'



export interface IBinanceOrderSchema {
  symbol: string
  orderId: number
  orderListId: number //Unless OCO, the value will always be -1
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