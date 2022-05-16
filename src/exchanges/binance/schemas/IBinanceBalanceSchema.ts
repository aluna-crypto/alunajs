export interface IBinanceBalancesSchema {
  spotBalances: IBinanceSpotBalanceSchema[]
  marginBalances: IBinanceMarginBalanceSchema[]
}


export interface IBinanceBalanceSchema {
  asset: string
  available: number
  total: number
}



export interface IBinanceSpotBalanceSchema {
  asset: string
  free: string
  locked: string
}



export interface IBinanceMarginBalanceSchema {
  asset: string
  free: string
  locked: string
  borrowed: string
  interest: string
  netAsset: string
}
