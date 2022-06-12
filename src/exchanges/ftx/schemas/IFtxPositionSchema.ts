import { FtxOrderSideEnum } from '../enums/FtxOrderSideEnum'



export interface IFtxPositionSchema {
  cost: number
  cumulativeBuySize?: number
  cumulativeSellSize?: number
  entryPrice: number
  estimatedLiquidationPrice: number | null
  future: string
  initialMarginRequirement: number
  longOrderSize:number
  maintenanceMarginRequirement: number
  netSize: number
  openSize: number
  realizedPnl: number
  unrealizedPnl: number
  recentAverageOpenPrice?: number
  recentBreakEvenPrice?: number
  recentPnl?: number
  shortOrderSize: number
  side: FtxOrderSideEnum
  size: number
  collateralUsed: number
}
