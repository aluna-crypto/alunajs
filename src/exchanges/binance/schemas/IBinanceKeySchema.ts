import {
  IBinanceMarginBalanceSchema,
  IBinanceSpotBalanceSchema,
} from './IBinanceBalanceSchema'



export interface IBinanceKeySchema extends IBinanceSpotAccountInfo {}



export interface IBinanceSpotAccountInfo {
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  updateTime: number
  accountType: string
  balances: IBinanceSpotBalanceSchema[]
  permissions: string[]
}



export interface IBinanceMarginAccountInfo {
  tradeEnabled: boolean
  transferEnabled: boolean
  borrowEnabled: boolean
  marginLevel: string
  totalAssetOfBtc: string
  totalLiabilityOfBtc: string
  totalNetAssetOfBtc: string
  userAssets: IBinanceMarginBalanceSchema[]
}
