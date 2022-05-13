import { IAlunaMarketSchema } from '../../../lib/schemas/IAlunaMarketSchema'
import { BitmexOrderSideEnum } from '../enums/BitmexOrderSideEnum'
import { BitmexOrderStatusEnum } from '../enums/BitmexOrderStatusEnum'
import { BitmexOrderTypeEnum } from '../enums/BitmexOrderTypeEnum'



export interface IBitmexOrdersSchema {
  bitmexOrders: IBitmexOrder[]
  markets: IAlunaMarketSchema[]
}



export interface IBitmexOrderSchema {
  bitmexOrder: IBitmexOrder
  market: IAlunaMarketSchema
}



export interface IBitmexOrder {
  orderID: string
  clOrdID: string
  clOrdLinkID: string
  account: number
  symbol: string
  side: BitmexOrderSideEnum
  simpleOrderQty: number | null
  orderQty: number
  price: number | null
  displayQty: number | null
  stopPx: number | null
  pegOffsetValue: number | null
  pegPriceType: string
  currency: string
  settlCurrency: string
  ordType: BitmexOrderTypeEnum
  timeInForce: string
  execInst: string
  contingencyType: string
  exDestination: string
  ordStatus: BitmexOrderStatusEnum
  triggered: 'StopOrderTriggered' | ''
  workingIndicator: true
  ordRejReason: string
  simpleLeavesQty: number | null
  leavesQty: number
  simpleCumQty: number | null
  cumQty: number
  avgPx: number | null
  multiLegReportingType: string
  text: string
  transactTime: string
  timestamp: string
}
