export interface IPoloniexBalanceInfoSchema {
  available: string
  onOrders: string
  btcValue: string
}

export interface IPoloniexBalanceSchema {
  [key: string]: IPoloniexBalanceInfoSchema
}

export interface IPoloniexBalanceWithCurrency extends IPoloniexBalanceInfoSchema {
  currency: string
}
