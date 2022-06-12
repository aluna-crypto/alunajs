import { OkxOrderSideEnum } from '../enums/OkxOrderSideEnum'
import { OkxOrderStatusEnum } from '../enums/OkxOrderStatusEnum'
import { OkxOrderTypeEnum } from '../enums/OkxOrderTypeEnum'



export interface IOkxOrderSchema {
  instType: string
  instId: string
  ccy: string
  ordId: string
  clOrdId: string
  tag: string
  px: string
  sz: string
  pnl: string
  ordType: OkxOrderTypeEnum
  side: OkxOrderSideEnum
  posSide: string
  tdMode: string
  accFillSz: string
  fillPx: string
  tradeId: string
  fillSz: string
  fillTime: string
  state: OkxOrderStatusEnum
  avgPx: string
  lever: string
  tpTriggerPx: string
  tpTriggerPxType: string
  tpOrdPx: string
  slTriggerPx: string
  slTriggerPxType: string
  slOrdPx: string
  feeCcy: string
  fee: string
  rebateCcy: string
  rebate: string
  tgtCcy: string
  category: string
  uTime: string
  cTime: string
}

export interface IOkxOrderPlaceResponseSchema {
  clOrdId: string
  ordId: string
  sCode: string
  sMsg: string
  tag: string
}
