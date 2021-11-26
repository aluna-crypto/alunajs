import { IBinanceBalanceSchema } from './IBinanceBalanceSchema'



export interface IBinanceKeyAccountSchema {
  makerCommission: number,
  takerCommission: number,
  buyerCommission: number,
  sellerCommission: number,
  canTrade: boolean,
  canWithdraw: boolean,
  canDeposit: boolean,
  updateTime: number,
  accountType: string,
  balances: IBinanceBalanceSchema[],
  permissions: string[]
}


export enum BinanceApiKeyPermissions {
  SPOT = 'SPOT',
}