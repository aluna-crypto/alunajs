import { BitmexOrderStatusEnum } from '../enums/BitmexOrderStatusEnum'
import { BitmexOrderTypeEnum } from '../enums/BitmexOrderTypeEnum'
import { BitmexSideEnum } from '../enums/BitmexSideEnum'



export interface IBitmexOrderSchema {
  orderID: string
  clOrdID: string
  clOrdLinkID: string
  account: number
  symbol: string
  side: BitmexSideEnum
  simpleOrderQty: number
  orderQty: number
  price: number
  displayQty: number
  stopPx: number
  pegOffsetValue: number
  pegPriceType: string
  currency: string
  settlCurrency: string
  ordType: BitmexOrderTypeEnum
  timeInForce: string
  execInst: string
  contingencyType: string
  exDestination: string
  ordStatus: BitmexOrderStatusEnum
  triggered: string
  workingIndicator: true
  ordRejReason: string
  simpleLeavesQty: number
  leavesQty: number
  simpleCumQty: number
  cumQty: number
  avgPx: number
  multiLegReportingType: string
  text: string
  transactTime: string
  timestamp: string
}
