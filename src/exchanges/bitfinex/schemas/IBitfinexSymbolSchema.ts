export interface IBitfinexSymbolsSchema {
  currencies: string[]
  currenciesNames: TBitfinexCurrenciesPairs
}


export interface IBitfinexSymbolSchema {
  currency: string
  currencyName: TBitfinexCurrencyPair | undefined
}



export type TBitfinexCurrencyPair = [currency: string, name: string]
export type TBitfinexCurrenciesPairs = Array<[currency: string, name: string]>
