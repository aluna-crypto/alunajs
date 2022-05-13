import {
  IPoloniexSymbolInfoSchema,
  IPoloniexSymbolResponseSchema,
  IPoloniexSymbolSchema,
} from '../../schemas/IPoloniexSymbolSchema'



export const POLONIEX_RAW_SYMBOL_INFO: IPoloniexSymbolInfoSchema[] = [
  {
    id: 125,
    name: 'Litecoin',
    humanType: 'BTC Clone',
    currencyType: 'address',
    txFee: '0.00100000',
    minConf: 4,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: '509BCA',
    blockchain: 'LTC',
    delisted: 0,
    isGeofenced: 0,
  },
  {
    id: 28,
    name: 'Bitcoin',
    humanType: 'BTC Clone',
    currencyType: 'address',
    txFee: '0.00050000',
    minConf: 2,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: 'F59C3D',
    blockchain: 'BTC',
    delisted: 0,
    isGeofenced: 0,
  },
  {
    id: 267,
    name: 'Ethereum',
    humanType: 'Sweep to Main Account',
    currencyType: 'address',
    txFee: '0.01387773',
    minConf: 12,
    depositAddress: '',
    disabled: 0,
    frozen: 0,
    depositDisabled: 0,
    hexColor: '1C1CE1',
    blockchain: 'ETH',
    delisted: 0,
    isGeofenced: 0,
  },
]


export const POLONIEX_RAW_SYMBOL_RESPONSE: IPoloniexSymbolResponseSchema = {
  LTC: POLONIEX_RAW_SYMBOL_INFO[0],
  BTC: POLONIEX_RAW_SYMBOL_INFO[1],
  ETH: POLONIEX_RAW_SYMBOL_INFO[2],
}

export const POLONIEX_RAW_SYMBOLS: IPoloniexSymbolSchema[] = [
  {
    ...POLONIEX_RAW_SYMBOL_INFO[0],
    currency: 'LTC',
  },
  {
    ...POLONIEX_RAW_SYMBOL_INFO[1],
    currency: 'BTC',
  },
  {
    ...POLONIEX_RAW_SYMBOL_INFO[2],
    currency: 'ETH',
  },
]

