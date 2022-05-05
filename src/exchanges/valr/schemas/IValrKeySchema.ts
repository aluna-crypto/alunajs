// TODO: Describe key interface for Valr exchange
export interface IValrKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
