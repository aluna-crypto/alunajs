import { AlunaWalletEnum } from '../enums/AlunaWalletEnum'



export interface IAlunaBalanceSchema {

  symbolId: string
  account: AlunaWalletEnum

  total: number
  available: number

  meta: any

}
