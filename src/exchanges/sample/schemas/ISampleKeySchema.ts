// TODO: Describe key interface for Sample exchange
export interface ISampleKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
