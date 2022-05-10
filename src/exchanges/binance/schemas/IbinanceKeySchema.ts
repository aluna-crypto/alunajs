// TODO: Describe key interface for binance exchange
export interface IbinanceKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
