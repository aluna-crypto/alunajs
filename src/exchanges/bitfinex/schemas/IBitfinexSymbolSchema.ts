export interface IBitfinexSymbols extends TBitfinexSymbolsResponse {}

type TBitfinexSymbolsResponse = [
  IBitfinexCurrencies, IBitfinexCurrencyLabels, IBitfinexCurrencySyms
]


export interface IBitfinexCurrencies extends Array<string> {}

export interface IBitfinexCurrencyLabels extends Array<TBitfinexCurrencyLabel> {}
export type TBitfinexCurrencyLabel = [currency: string, name: string]

export interface IBitfinexCurrencySyms extends Array<TBitfinexCurrencySym> {}
export type TBitfinexCurrencySym = [currency: string, symbolId: string]

