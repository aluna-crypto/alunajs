import { PoloniexPositionSideEnum } from '../enums/PoloniexPositionSideEnum'



export interface IPoloniexPositionInfo {
  amount: string,
  total: string
  basePrice: string
  liquidationPrice: number
  pl: string
  lendingFees: string
  type: PoloniexPositionSideEnum
}

export interface IPoloniexPositionSchema {
  [key: string]: 
}

export interface IPoloniexPositionWithCurrency extends IPoloniexPositionInfo {
  currencyPair: string
  baseCurrency: string
  quoteCurrency: string
}