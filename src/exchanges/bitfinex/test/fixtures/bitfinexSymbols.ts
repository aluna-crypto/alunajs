import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { Bitfinex } from '../../Bitfinex'
import {
  IBitfinexCurrencies,
  TBitfinexCurrencyLabel,
  TBitfinexCurrencySym,
} from '../../schemas/IBitfinexSymbolSchema'



export const BITFINEX_CURRENCIES: IBitfinexCurrencies = [
  'AAVE',
  'ADA',
  'BTC',
  'ETH',
  'EUR',
  'USD',
  'UST',
  'UDC',
  'USTF0',
]



export const BITFINEX_CURRENCIES_LABELS: TBitfinexCurrencyLabel[] = [
  ['AAVE', 'AAVE'],
  ['ADA', 'Cardano ADA'],
  ['BTC', 'Bitcoin'],
  ['ETH', 'Ethereum'],
  ['EUR', 'Euro'],
  ['USD', 'US Dollar'],
  ['UDC', 'USDC'],
  ['UST', 'Tether USDt'],
]



export const BITFINEX_CURRENCIES_SYMS: TBitfinexCurrencySym[] = [
  ['UDC', 'USDC'],
  ['UST', 'USDT'],
]



export const BITFINEX_RAW_SYMBOLS = [
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
  BITFINEX_CURRENCIES_SYMS,
]



export const BITFINEX_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    exchangeId: Bitfinex.ID,
    id: 'AAVE',
    name: 'AAVE',
    meta: {
      currency: 'AAVE',
      currencyLabel: ['AAVE', 'AAVE'],
    },
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'ADA',
    name: 'Cardano ADA',
    meta: {
      currency: 'ADA',
      currencyLabel: ['ADA', 'Cardano ADA'],
    },
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'BTC',
    name: 'Bitcoin',
    meta: {
      currency: 'BTC',
      currencyLabel: ['BTC', 'Bitcoin'],
    },
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'ETH',
    name: 'Ethereum',
    meta: {
      currency: 'ETH',
      currencyLabel: ['ETH', 'Ethereum'],
    },
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'EUR',
    name: 'Euro',
    meta: {
      currency: 'EUR',
      currencyLabel: ['EUR', 'Euro'],
    },
  },
  {
    id: 'USD',
    name: 'US Dollar',
    exchangeId: 'bitfinex',
    meta: {
      currency: 'USD',
      currencyLabel: ['USD', 'US Dollar'],
    },
  },
  {
    id: 'USDT',
    name: 'Tether USDt',
    exchangeId: 'bitfinex',
    meta: {
      currency: 'UST',
      currencyLabel: ['UST', 'Tether USDt'],
      currencySym: ['UST', 'USDt'],
    },
  },
  {
    id: 'UDC',
    name: 'USDC',
    exchangeId: 'bitfinex',
    meta: {
      currency: 'UDC',
      currencyLabel: ['UDC', 'USDc'],
      currencySym: ['UDC', 'USDC'],
    },
  },
]
