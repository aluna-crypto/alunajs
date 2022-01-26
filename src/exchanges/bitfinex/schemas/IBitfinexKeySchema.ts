export interface IBitfinexKey extends TBitfinexKey {}



type TBitfinexKey = [
  [scope: 'account', read: number, write: number],
  [scope: 'orders', read: number, write: number],
  [scope: 'funding', read: number, write: number],
  [scope: 'settings', read: number, write: number],
  [scope: 'wallets', read: number, write: number],
  [scope: 'withdraw', read: number, write: number],
]
