import { IGateioSymbolSchema } from '../../schemas/IGateioSymbolSchema'



export const GATEIO_RAW_SYMBOLS: IGateioSymbolSchema[] = [
  {
    id: 'BTC_USDT',
    base: 'BTC',
    quote: 'USDT',
    fee: '0.2',
    min_base_amount: '0.0001',
    min_quote_amount: '1',
    amount_precision: 4,
    precision: 2,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
  },
  {
    id: 'ETH_USD',
    base: 'ETH',
    quote: 'USD',
    fee: '0.2',
    min_quote_amount: '1',
    min_base_amount: '0.0001',
    amount_precision: 4,
    precision: 2,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
  },
  {
    id: 'BNB_BTC',
    base: 'BNB',
    quote: 'BTC',
    fee: '0.2',
    amount_precision: 3,
    precision: 4,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
    min_base_amount: '0.0001',
    min_quote_amount: '1',
  },
  {
    id: 'LTC_USDT',
    base: 'LTC',
    quote: 'USDT',
    fee: '0.2',
    min_quote_amount: '1',
    amount_precision: 3,
    precision: 4,
    trade_status: 'tradable',
    sell_start: 0,
    buy_start: 0,
    min_base_amount: '0.0001',
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
