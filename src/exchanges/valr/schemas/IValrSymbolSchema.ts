// TODO: Describe symbol interface for Valr exchange
export interface IValrSymbolSchema {
  symbol: string
  isActive: boolean
  shortName: string
  longName: string
  decimalPlaces: number
  withdrawalDecimalPlaces: number
}
