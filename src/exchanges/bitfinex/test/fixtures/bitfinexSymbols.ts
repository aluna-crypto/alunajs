import {
  IBitfinexSymbolsSchema,
  TBitfinexCurrenciesPairs,
} from '../../schemas/IBitfinexSymbolSchema'



export const BITFINEX_CURRENCIES: string[] = [
  'BTC',
  'ADA',
  'AAVE',
]



export const BITFINEX_CURRENCIES_LABELS: TBitfinexCurrenciesPairs = [
  ['BTC', 'Bitcoin'],
  ['ADA', 'Cardano ADA'],
]



export const BITFINEX_RAW_SYMBOLS: IBitfinexSymbolsSchema = {
  currencies: BITFINEX_CURRENCIES,
  currenciesNames: BITFINEX_CURRENCIES_LABELS,
}
