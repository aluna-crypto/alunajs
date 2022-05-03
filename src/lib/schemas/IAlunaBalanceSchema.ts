import { AlunaWalletEnum } from '../enums/AlunaWalletEnum'



export interface IAlunaBalanceSchema {

  symbolId: string

  exchangeId?: string // if it belongs to exchange
  chainId?: string // if it belongs to web3

  wallet: AlunaWalletEnum

  total: number
  available: number

  meta: any

}
