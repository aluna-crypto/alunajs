export interface IPoloniexBalanceInfoSchema {
  available: string
  onOrders: string
  btcValue: string
}

export interface IPoloniexBalanceResponseSchema {
  [key: string]: IPoloniexBalanceInfoSchema
}

export interface IPoloniexBalanceSchema extends IPoloniexBalanceInfoSchema {
  currency: string
}
