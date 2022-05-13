import { BinanceOrderSideEnum } from '../enums/BinanceOrderSideEnum'
import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { IBinanceSymbolSchema } from './IBinanceSymbolSchema'



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
  side: BinanceOrderSideEnum
  stopPrice?: string
  icebergQty?: string
  time?: number
  updateTime?: number
  transactTime?: number
  isWorking?: boolean
  origQuoteOrderQty?: string
  fills?: IBinanceOrderFills[]
}

export interface IBinanceOrderFills {
  price: string
  qty: string
  commission: string
  commissionAsset: string
  tradeId: number
}

export interface IBinanceOrdersResponseSchema {
  rawOrders: IBinanceOrderSchema[]
  rawSymbols: IBinanceSymbolSchema[]
}

export interface IBinanceOrderResponseSchema {
  rawOrder: IBinanceOrderSchema
  rawSymbol: IBinanceSymbolSchema
}
