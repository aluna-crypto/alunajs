export interface IBitfinexSymbols extends TSymbolsTuple {}

type TSymbolsTuple = [
  IBitfinexSymbolsIds, IBitfinexSymbolsLabels, IProperBitfinexSymbolsIds
]

export interface IBitfinexSymbolsIds extends Array<string> {}

export interface IBitfinexSymbolsLabels extends Array<[bitfinexSymbolId: string, symbolName: string]> {}

export interface IProperBitfinexSymbolsIds extends Array<[bitfinexSymbolId: string, symbolId: string]> {}
