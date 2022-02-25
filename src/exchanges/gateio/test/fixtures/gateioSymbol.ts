import { IGateioSymbolSchema } from '../../schemas/IGateioSymbolSchema'



export const GATEIO_RAW_SYMBOLS: IGateioSymbolSchema[] = [
  {
    currency: 'BTC',
    delisted: false,
    deposit_disabled: false,
    trade_disabled: false,
    withdraw_delayed: false,
    withdraw_disabled: false,
  },
  {
    currency: 'ETH',
    delisted: false,
    deposit_disabled: false,
    trade_disabled: false,
    withdraw_delayed: false,
    withdraw_disabled: false,
  },
  {
    currency: 'BNB',
    delisted: false,
    deposit_disabled: false,
    trade_disabled: false,
    withdraw_delayed: false,
    withdraw_disabled: false,
  },
  {
    currency: 'LTC',
    delisted: false,
    deposit_disabled: false,
    trade_disabled: false,
    withdraw_delayed: false,
    withdraw_disabled: false,
  },
]

export const GATEIO_PARSED_SYMBOLS = [
  {
    id: 'BNB',
    exchangeId: 'gateio',
    meta: {},
  },
  {
    id: 'BTC',
    exchangeId: 'gateio',
    meta: {},
  },
  {
    id: 'LTC',
    exchangeId: 'gateio',
    meta: {},
  },
  {
    id: 'ETH',
    exchangeId: 'gateio',
    meta: {},
  },
]
