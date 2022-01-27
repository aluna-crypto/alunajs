import { IAlunaKeySchema } from '../../../..'
import { IBitfinexKey } from '../../schemas/IBitfinexKeySchema'



export const BITFINEX_RAW_KEY: IBitfinexKey = [
  ['account', 1, 0],
  ['orders', 1, 1],
  ['funding', 1, 0],
  ['settings', 0, 0],
  ['wallets', 1, 0],
  ['withdraw', 0, 0],
]



export const BITFINEX_PARSED_KEY: IAlunaKeySchema = {
  permissions: {
    read: true,
    trade: true,
    withdraw: false,
  },
  accountId: undefined,
  meta: [
    ['account', 1, 0],
    ['orders', 1, 1],
    ['funding', 1, 0],
    ['settings', 0, 0],
    ['wallets', 1, 0],
    ['withdraw', 0, 0],
  ],
}
