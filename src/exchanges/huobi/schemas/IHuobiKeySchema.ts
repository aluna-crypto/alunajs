// TODO: Describe key interface for Huobi exchange
export interface IHuobiKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
