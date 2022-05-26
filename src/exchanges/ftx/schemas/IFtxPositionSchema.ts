import { FtxOrderSideEnum } from '../enums/FtxOrderSideEnum'



export interface IFtxPositionSchema {
  cost: number
  cumulativeBuySize: number
  cumulativeSellSize: number
  entryPrice: number
  estimatedLiquidationPrice: number
  future: string
  initialMarginRequirement: number
  longOrderSize:number
  maintenanceMarginRequirement: number
  netSize: number
  openSize: number
  realizedPnl: number
  recentAverageOpenPrice: number
  recentBreakEvenPrice: number
  recentPnl: number
  shortOrderSize: number
  side: FtxOrderSideEnum
  size: number
  unrealizedPnl: 0
  collateralUsed: number
}
