import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../enums/AlunaOrderStatusEnum'
import { AlunaOrderTriggerStatusEnum } from '../enums/AlunaOrderTriggerStatusEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { IAlunaUICustomDisplaySchema } from './IAlunaUICustomDisplaySchema'



export interface IAlunaOrderUICustomDisplay {
  amount: IAlunaUICustomDisplaySchema
  rate?: IAlunaUICustomDisplaySchema
  limitRate?: IAlunaUICustomDisplaySchema
  stopRate?: IAlunaUICustomDisplaySchema
  total: IAlunaUICustomDisplaySchema
}



export interface IAlunaOrderSchema {

  id: string
  symbolPair: string

  exchangeId: string
  baseSymbolId: string
  quoteSymbolId: string

  total: number
  amount: number
  uiCustomDisplay?: IAlunaOrderUICustomDisplay

  rate?: number
  stopRate?: number
  limitRate?: number

  account: AlunaAccountEnum
  side: AlunaOrderSideEnum
  status: AlunaOrderStatusEnum
  type: AlunaOrderTypesEnum

  triggerStatus?: AlunaOrderTriggerStatusEnum

  placedAt: Date
  filledAt?: Date
  canceledAt?: Date

  meta: any

}
