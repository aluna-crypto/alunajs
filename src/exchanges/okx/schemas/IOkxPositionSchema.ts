import { OkxPositionSideEnum } from '../enums/OkxPositionSideEnum'



export interface IOkxPositionSchema {
  adl: string
  availPos: string
  avgPx: string
  cTime: string
  ccy: string
  deltaBS: string
  deltaPA: string
  gammaBS: string
  gammaPA: string
  imr: string
  instId: string
  instType: string
  interest: string
  usdPx: string
  last: string
  lever: string
  liab: string
  liabCcy: string
  liqPx: string
  markPx: string
  margin: string
  mgnMode: string
  mgnRatio: string
  mmr: string
  notionalUsd: string
  optVal: string
  pTime: string
  pos: string
  posCcy: string
  posId: string
  posSide: OkxPositionSideEnum
  thetaBS: string
  thetaPA: string
  tradeId: string
  uTime: string
  upl: string
  uplRatio: string
  vegaBS: string
  vegaPA: string
  baseBal: string
  quoteBal: string
}

export interface IOkxPositionCloseResponseSchema {
  clOrdId: string
  ordId: string
  sCode: string
  sMsg: string
}

export interface IOkxSetPositionLeverageResponseSchema {
  lever: string
  mgnMode: string
  instId: string
  posSide: string
}
