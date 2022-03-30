export interface IBitfinexSymbolSchema extends TBitfinexSymbolsResponse {}

type TBitfinexSymbolsResponse = [
  IBitfinexCurrencies,
  IBitfinexCurrencyLabels,
]


export interface IBitfinexCurrencies extends Array<string> {}

export interface IBitfinexCurrencyLabels extends Array<TBitfinexCurrencyLabel> {}
export type TBitfinexCurrencyLabel = [currency: string, name: string]

