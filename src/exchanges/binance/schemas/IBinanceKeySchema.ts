// TODO: Describe key interface for Binance exchange
export interface IBinanceKeySchema {
  read: boolean
  trade: boolean
  withdraw: boolean
  accountId?: string
  // ...
}
