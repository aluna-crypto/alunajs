// TODO: Describe key interface for Bitfinex exchange
export interface IBitfinexKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
