import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../enums/AlunaPositionStatusEnum'
import { AlunaSideEnum } from '../enums/AlunaSideEnum'



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

  account: AlunaAccountEnum
  side: AlunaSideEnum
  status: AlunaPositionStatusEnum

  pnl: number
  pnlPercentage: number

  leverage?: number
  crossMargin?: boolean

  openedAt?: Date
  closedAt?: Date

  meta: any

}
