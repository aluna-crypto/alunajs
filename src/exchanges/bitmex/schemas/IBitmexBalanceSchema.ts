export interface IBitmexBalancesSchema {
  assets: IBitmexAsset[]
  assetsDetails: IBitmexAssetDetails[]
}



export interface IBitmexBalanceSchema {
  asset: IBitmexAsset
  assetDetails: IBitmexAssetDetails
}



export interface IBitmexAsset {
  account: number
  currency: string
  riskLimit: number | null
  prevState: string
  state: string
  action: string
  amount: number
  pendingCredit: number
  pendingDebit: number
  confirmedDebit: number
  prevRealisedPnl: number
  prevUnrealisedPnl: number
  grossComm: number
  grossOpenCost: number
  grossOpenPremium: number
  grossExecCost: number
  grossMarkValue: number
  riskValue: number
  taxableMargin: number
  initMargin: number
  maintMargin: number
  sessionMargin: number
  targetExcessMargin: number
  varMargin: number
  realisedPnl: number
  unrealisedPnl: number
  indicativeTax: number
  unrealisedProfit: number
  syntheticMargin: number | null
  walletBalance: number
  marginBalance: number
  marginBalancePcnt: number
  marginLeverage: number
  marginUsedPcnt: number
  excessMargin: number
  excessMarginPcnt: number
  availableMargin: number
  withdrawableMargin: number
  grossLastValue: number
  commission: number | null
  makerFeeDiscount: number | null
  takerFeeDiscount: number | null
  timestamp: string
}



export interface IBitmexAssetDetails {
  asset: string
  currency: string
  majorCurrency: string
  name: string
  currencyType: string
  scale: number
  enabled: boolean
  isMarginCurrency: boolean
  minDepositAmount: number
  minWithdrawalAmount: number
  maxWithdrawalAmount: number
  networks: IBitmexAssetDetailsNetwork[]
}



export interface IBitmexAssetDetailsNetwork {
  asset: string
  tokenAddress: string
  depositEnabled: boolean
  withdrawalEnabled: boolean
  withdrawalFee: number
  minFee: number
  maxFee: number
}
