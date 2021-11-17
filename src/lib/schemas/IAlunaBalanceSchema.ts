import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'



export interface IAlunaBalanceSchema {

  symbolId: string
  account: AlunaAccountEnum

  total: number
  available: number

  meta: any

}
