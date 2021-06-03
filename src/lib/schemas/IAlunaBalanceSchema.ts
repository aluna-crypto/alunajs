import { AccountEnum } from '../enums/AccountEnum'



export interface IAlunaBalanceSchema {

  symbolId: string
  account: AccountEnum

  total: number
  available: number

}
