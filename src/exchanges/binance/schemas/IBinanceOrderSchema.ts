export interface IBinanceOrderSchema {
  symbol: string
  orderId: number
  orderListId: number //Unless OCO, the value will always be -1
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  timeInForce: string
  type: string
  side: string
  stopPrice: string
  icebergQty: string
  time: number
  updateTime: number
  isWorking: boolean
  origQuoteOrderQty: string
}