// TODO: Describe key interface for Bitmex exchange
export interface IBitmexKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
