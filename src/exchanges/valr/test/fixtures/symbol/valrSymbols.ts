import { IAlunaSymbolSchema } from '../../../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../../../schemas/IValrSymbolSchema'



export const VALR_FETCH_SYMBOLS_RESPONSE: IValrSymbolSchema[] = [
  {
    symbol: 'R',
    isActive: true,
    shortName: 'ZAR',
    longName: 'Rand',
    decimalPlaces: 2,
    withdrawalDecimalPlaces: 2,
  },
  {
    symbol: 'BTC',
    isActive: true,
    shortName: 'BTC',
    longName: 'Bitcoin',
    decimalPlaces: 8,
    withdrawalDecimalPlaces: 8,
  },
  {
    symbol: 'ETH',
    isActive: true,
    shortName: 'ETH',
    longName: 'Ethereum',
    decimalPlaces: 18,
    withdrawalDecimalPlaces: 8,
  },
]



export const VALR_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    id: 'ZAR',
    name: 'Rand',
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
  },
]
