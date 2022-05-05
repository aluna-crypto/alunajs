import { IValrSymbolSchema } from '../../schemas/IValrSymbolSchema'



// TODO: Review fixtures
export const VALR_RAW_SYMBOLS: IValrSymbolSchema[] = [
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

