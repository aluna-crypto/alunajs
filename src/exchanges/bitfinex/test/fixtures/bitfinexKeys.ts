import { IAlunaKeySchema } from '../../../../lib/schemas/IAlunaKeySchema'
import {
  IBitfinexKeySchema,
  IBitfinexPermissionsScope,
} from '../../schemas/IBitfinexKeySchema'



export const BITFINEX_USER_ACCOUNT_ID = 'userId'

export const BITFINEX_PERMISSIONS_SCOPE: IBitfinexPermissionsScope = [
  ['account', 1, 0],
  ['orders', 1, 1],
  ['funding', 1, 0],
  ['settings', 0, 0],
  ['wallets', 1, 0],
  ['withdraw', 0, 0],
]

export const BITFINEX_RAW_KEY: IBitfinexKeySchema = {
  permissionsScope: BITFINEX_PERMISSIONS_SCOPE,
  accountId: BITFINEX_USER_ACCOUNT_ID,
}

export const BITFINEX_PARSED_KEY: IAlunaKeySchema = {
  permissions: {
    read: true,
    trade: true,
    withdraw: false,
  },
  accountId: BITFINEX_USER_ACCOUNT_ID,
  meta: {
    permissionsScope: BITFINEX_PERMISSIONS_SCOPE,
    accountId: BITFINEX_USER_ACCOUNT_ID,
  },
}
