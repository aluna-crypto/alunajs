import {
  IBitfinexKeySchema,
  IBitfinexPermissionsScope,
} from '../../schemas/IBitfinexKeySchema'



export const BITFINEX_KEY_PERMISSIONS: IBitfinexPermissionsScope = [
  ['account', 1, 0],
  ['orders', 1, 1],
  ['funding', 1, 0],
  ['settings', 1, 0],
  ['wallets', 1, 0],
  ['withdraw', 1, 0],
]



export const BITFINEX_RAW_KEY: IBitfinexKeySchema = {
  accountId: 'accountId',
  permissionsScope: BITFINEX_KEY_PERMISSIONS,
}
