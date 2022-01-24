export interface IBitfinexSymbols extends TSymbolsTuple {}

type TSymbolsTuple = [
  IBitfinexSymbolsIds, IBitfinexSymbolsLabels, IProperBitfinexSymbolsIds
]


export interface IBitfinexSymbolsIds extends Array<string> {}

export interface IBitfinexSymbolsLabels extends Array<TBitfinexLabel> {}
export type TBitfinexLabel = [bitfinexSymbolId: string, symbolName: string]

export interface IProperBitfinexSymbolsIds extends Array<TBitfinexProperSymbol> {}
export type TBitfinexProperSymbol = [bitfinexSymbolId: string, symbolId: string]
