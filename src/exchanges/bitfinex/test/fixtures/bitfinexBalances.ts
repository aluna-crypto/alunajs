import { BitfinexAccountsEnum } from '../../enums/BitfinexAccountsEnum'
import { IBitfinexBalanceSchema } from '../../schemas/IBitfinexBalanceSchema'



export const BITFINEX_RAW_BALANCES: IBitfinexBalanceSchema[] = [
  [
    BitfinexAccountsEnum.EXCHANGE,
    'BTC',
    7.35296e-7,
    0,
    7.35296e-7,
    'Exchange 0.0008 ETH for BTC @ 0.065457',
    {
      reason: 'TRADE',
      order_id: 85415335168,
      order_id_oppo: 85414771121,
      trade_price: '0.065457',
      trade_amount: '0.0008',
      order_cid: 1643374392723,
      order_gid: null,
    },
  ],
  [
    BitfinexAccountsEnum.MARGIN,
    'ATO',
    0.1992,
    0,
    0.1992,
    'Exchange 0.2 ATO for USD @ 37.271',
    {
      reason: 'TRADE',
      order_id: 83954431710,
      order_id_oppo: 83976564149,
      trade_price: '37.271',
      trade_amount: '-0.2',
      order_cid: 1642169849457,
      order_gid: null,
    },
  ],
  [
    BitfinexAccountsEnum.FUNDING,
    'USD',
    13.89214731,
    0,
    13.89214731,
    'Exchange 0.002 ETH for USD @ 3296.6',
    {
      reason: 'TRADE',
      order_id: 83987077107,
      order_id_oppo: 83988987713,
      trade_price: '3296.6',
      trade_amount: '0.002',
      order_cid: 1642178828606,
      order_gid: null,
    },
  ],
]
