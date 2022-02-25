import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaPositionStatusEnum } from '../enums/AlunaPositionStatusEnum'
import { AlunaSideEnum } from '../enums/AlunaSideEnum'
import { IAlunaUICustomDisplaySchema } from './IAlunaUICustomDisplaySchema'



export interface IAlunaUIPositionCustomDisplay {
  amount: IAlunaUICustomDisplaySchema
  rate: IAlunaUICustomDisplaySchema
  total: IAlunaUICustomDisplaySchema
  pnl: IAlunaUICustomDisplaySchema
}



export interface IAlunaPositionSchema {

  id?: string | number
  symbolPair: string

  exchangeId: string
  baseSymbolId: string
  quoteSymbolId: string

  total: number
  amount: number
  uiCustomDisplay?: IAlunaUIPositionCustomDisplay

  basePrice: number
  openPrice: number
  closePrice?: number
  liquidationPrice: number

  account: AlunaAccountEnum
  side: AlunaSideEnum
  status: AlunaPositionStatusEnum

  pl: number
  plPercentage: number

  leverage?: number
  crossMargin?: boolean

  openedAt: Date
  closedAt?: Date

  meta: any

}
