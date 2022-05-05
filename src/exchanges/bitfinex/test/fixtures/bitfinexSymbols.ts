import {
  IBitfinexSymbolSchema,
  IBitfinexSymbolsSchema,
  TBitfinexCurrenciesPairs,
} from '../../schemas/IBitfinexSymbolSchema'



export const BITFINEX_CURRENCIES: string[] = [
  'AAVE',
  'ADA',
  'BTC',
]



export const BITFINEX_CURRENCIES_LABELS: TBitfinexCurrenciesPairs = [
  ['AAVE', 'AAVE'],
  ['ADA', 'Cardano ADA'],
  ['BTC', 'Bitcoin'],
]



export const BITFINEX_RAW_SYMBOLS: IBitfinexSymbolsSchema = {
  currencies: BITFINEX_CURRENCIES,
  currenciesNames: BITFINEX_CURRENCIES_LABELS,
}



export const BITFINEX_RAW_SYMBOL: IBitfinexSymbolSchema = {
  currency: BITFINEX_CURRENCIES[0],
  currencyName: BITFINEX_CURRENCIES_LABELS[0],
}
