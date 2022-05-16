import {
  IPoloniexBalanceInfoSchema,
  IPoloniexBalanceResponseSchema,
  IPoloniexBalanceSchema,
} from '../../schemas/IPoloniexBalanceSchema'



export const POLONIEX_RAW_BALANCES_INFO: IPoloniexBalanceInfoSchema[] = [
  {
    available: '3.00000000',
    onOrders: '2.00000000',
    btcValue: '0.00000000',
  },
  {
    available: '5.00000000',
    onOrders: '0.00000000',
    btcValue: '0.00000000',
  },
  {
    available: '0.00000000',
    onOrders: '0.00000000',
    btcValue: '0.00000000',
  },
]


export const POLONIEX_RAW_BALANCES_RESPONSE: IPoloniexBalanceResponseSchema = {
  BNB: POLONIEX_RAW_BALANCES_INFO[0],
  ETH: POLONIEX_RAW_BALANCES_INFO[1],
  BTC: POLONIEX_RAW_BALANCES_INFO[2],
}

export const POLONIEX_RAW_BALANCES: IPoloniexBalanceSchema[] = [
  {
    currency: 'BNB',
    ...POLONIEX_RAW_BALANCES_INFO[0],
  },
  {
    currency: 'ETH',
    ...POLONIEX_RAW_BALANCES_INFO[1],
  },
  {
    currency: 'BTC',
    ...POLONIEX_RAW_BALANCES_INFO[2],
  },
]

