import { AccountEnum } from '../enums/AccountEnum'



export interface IAlunaBalanceSchema {
  symbolAcronym: string
  total: number
  available: number
  account: AccountEnum
}
