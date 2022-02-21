import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaBalanceSchema } from '../../../../lib/schemas/IAlunaBalanceSchema'
import {
  IPoloniexBalanceSchema,
  IPoloniexBalanceWithCurrency,
} from '../../schemas/IPoloniexBalanceSchema'



export const POLONIEX_RAW_BALANCES: IPoloniexBalanceSchema = {
  BNB: {
    available: '3.00000000',
    onOrders: '2.00000000',
    btcValue: '0.00000000',
  },
  ETH: {
    available: '5.00000000',
    onOrders: '0.00000000',
    btcValue: '0.00000000',
  },
  BTC: {
    available: '0.00000000',
    onOrders: '0.00000000',
    btcValue: '0.00000000',
  },
}

export const POLONIEX_RAW_BALANCES_WITH_CURRENCY
  : IPoloniexBalanceWithCurrency[] = [
    {
      currency: 'BNB',
      available: '3.00000000',
      onOrders: '2.00000000',
      btcValue: '0.00000000',
    },
    {
      currency: 'ETH',
      available: '5.00000000',
      onOrders: '0.00000000',
      btcValue: '0.00000000',
    },
    {
      currency: 'BTC',
      available: '0.00000000',
      onOrders: '0.00000000',
      btcValue: '0.00000000',
    },
  ]

export const POLONIEX_PARSED_BALANCES: IAlunaBalanceSchema[] = [
  {
    symbolId: 'BNB',
    account: AlunaAccountEnum.EXCHANGE,
    available: 3,
    total: 5,
    meta: {},
  },
  {
    symbolId: 'ETH',
    account: AlunaAccountEnum.EXCHANGE,
    available: 5,
    total: 5,
    meta: {},
  },
]
