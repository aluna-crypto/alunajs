import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../enums/AlunaSideEnum'
import { IAlunaUICustomDisplaySchema } from './IAlunaUICustomDisplaySchema'



export interface IAlunaOrderUICustomDisplay {
  amount: IAlunaUICustomDisplaySchema
  rate?: IAlunaUICustomDisplaySchema
  limitRate?: IAlunaUICustomDisplaySchema
  stopRate?: IAlunaUICustomDisplaySchema
  total: IAlunaUICustomDisplaySchema
}



export interface IAlunaOrderSchema {

  id: string | number
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
  side: AlunaSideEnum
  status: AlunaOrderStatusEnum
  type: AlunaOrderTypesEnum

  placedAt: Date
  filledAt?: Date
  canceledAt?: Date

  meta: any

}
