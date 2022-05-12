// TODO: Describe key interface for Poloniex exchange
export interface IPoloniexKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
