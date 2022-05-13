import { IBinanceBalanceSchema } from './IBinanceBalanceSchema'



export interface IBinanceKeySchema {
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  updateTime: number
  accountType: string
  balances: IBinanceBalanceSchema[]
  permissions: string[]
}
