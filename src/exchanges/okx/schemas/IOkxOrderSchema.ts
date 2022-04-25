import { OkxOrderStatusEnum } from '../enums/OkxOrderStatusEnum'
import { OkxOrderTypeEnum } from '../enums/OkxOrderTypeEnum'
import { OkxSideEnum } from '../enums/OkxSideEnum'



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
  side: OkxSideEnum
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

export interface IOkxOrderRequest {
  instId:string
  tdMode:string
  side: OkxSideEnum
  ordType: OkxOrderTypeEnum
  sz: string
  px?: string
}
