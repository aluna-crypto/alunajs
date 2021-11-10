import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { IValrSymbolSchema } from '../../schemas/IValrSymbolSchema'
import { Valr } from '../../Valr'



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



export const VALR_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    exchangeId: Valr.ID,
    id: 'ZAR',
    name: 'Rand',
  },
  {
    exchangeId: Valr.ID,
    id: 'BTC',
    name: 'Bitcoin',
  },
  {
    exchangeId: Valr.ID,
    id: 'ETH',
    name: 'Ethereum',
  },
]
