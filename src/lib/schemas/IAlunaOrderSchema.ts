import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../enums/AlunaSideEnum'



export interface IAlunaOrderSchema {

  id: string | number
  symbolPair: string

  total: number
  amount: number
  isAmountInContracts: boolean

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
