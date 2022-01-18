import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../enums/AlunaSideEnum'



export interface IAlunaOrderSchema {

  id: string | number
  symbolPair: string

  exchangeId: string
  baseSymbolId: string
  quoteSymbolId: string

  total: number
  amount: number

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
