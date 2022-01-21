import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { Bitfinex } from '../../Bitfinex'
import { IBitfinexSymbols } from '../../schemas/IBitfinexMarketSchema'



export const BITFINEX_RAW_SYMBOLS: IBitfinexSymbols[] = [
  [
    ['AAVE', 'AAVE'],
    ['ADA', 'Cardano ADA'],
    ['BTC', 'Bitcoin'],
    ['ETH', 'Ethereum'],
    ['EUR', 'Euro'],
    ['USD', 'US Dollar'],
  ],
]

export const BITFINEX_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    exchangeId: Bitfinex.ID,
    id: 'AAVE',
    name: 'AAVE',
    meta: ['AAVE', 'AAVE'],
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'ADA',
    name: 'Cardano ADA',
    meta: ['ADA', 'Cardano ADA'],
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'BTC',
    name: 'Bitcoin',
    meta: ['BTC', 'Bitcoin'],
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'ETH',
    name: 'Ethereum',
    meta: ['ETH', 'Ethereum'],
  },
  {
    exchangeId: Bitfinex.ID,
    id: 'EUR',
    name: 'Euro',
    meta: ['EUR', 'Euro'],
  },
  {
    id: 'USD',
    name: 'US Dollar',
    exchangeId: 'bitfinex',
    meta: ['USD', 'US Dollar'],
  },
]
