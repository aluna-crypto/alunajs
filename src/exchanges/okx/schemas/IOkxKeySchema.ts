// TODO: Describe key interface for Okx exchange
export interface IOkxKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
