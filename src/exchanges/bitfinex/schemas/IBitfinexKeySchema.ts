export interface IBitfinexKeySchema {
  accountId: string
  permissionsScope: IBitfinexPermissionsScope
}

export interface IBitfinexPermissionsScope extends TBitfinexPermissionsScope {}

type TBitfinexPermissionsScope = [
  [scope: 'account', read: number, write: number],
  [scope: 'orders', read: number, write: number],
  [scope: 'funding', read: number, write: number],
  [scope: 'settings', read: number, write: number],
  [scope: 'wallets', read: number, write: number],
  [scope: 'withdraw', read: number, write: number],
]
