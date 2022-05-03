import { AlunaWalletEnum } from '../../../../lib/enums/AlunaWalletEnum'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import { IBittrexBalanceSchema } from '../../schemas/IBittrexBalanceSchema'



export const BITTREX_RAW_BALANCES: IBittrexBalanceSchema[] = [
  {
    currencySymbol: 'BTC',
    total: '1500.00000000',
    available: '1500.00000000',
    updatedAt: '2021-11-23T17:32:17.06Z',
  },
  {
    currencySymbol: 'ETH',
    total: '32.00000000',
    available: '32.00000000',
    updatedAt: '2021-11-23T17:32:17.06Z',
  },
  {
    currencySymbol: 'LTC',
    total: '11.00000000',
    available: '11.00000000',
    updatedAt: '2021-11-23T17:32:17.06Z',
  },
  {
    currencySymbol: 'USD',
    total: '0.00000000',
    available: '0.00000000',
    updatedAt: '2021-11-23T17:32:17.06Z',
  },
]

export const BITTREX_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'BTC',
    wallet: AlunaWalletEnum.EXCHANGE,
    available: 1500,
    total: 1500,
    meta: {},
  },
  {
    symbolId: 'ETH',
    wallet: AlunaWalletEnum.EXCHANGE,
    available: 32,
    total: 32,
    meta: {},
  },
  {
    symbolId: 'LTC',
    wallet: AlunaWalletEnum.EXCHANGE,
    available: 11,
    total: 11,
    meta: {},
  },
]
