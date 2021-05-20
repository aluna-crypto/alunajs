import { AccountEnum } from '../enums/AccountEnum'
import { PositionStatusEnum } from '../enums/PositionStatusEnum'
import { SideEnum } from '../enums/SideEnum'



export interface IAlunaPositionSchema {

  id?: string | number

  marketId: string

  total: number
  amount: number
  isAmountInContracts: boolean

  basePrice: number
  openPrice: number
  closePrice?: number
  liquidationPrice: number

  account: AccountEnum
  side: SideEnum
  status: PositionStatusEnum

  pnl: number
  pnlPercentage: number

  leverage?: number
  crossMargin?: boolean

  openedAt: Date
  closedAt?: Date

}
