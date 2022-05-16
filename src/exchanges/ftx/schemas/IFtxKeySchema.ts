// TODO: Describe key interface for Ftx exchange
export interface IFtxKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
