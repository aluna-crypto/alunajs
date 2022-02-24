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
  triggered: string
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
