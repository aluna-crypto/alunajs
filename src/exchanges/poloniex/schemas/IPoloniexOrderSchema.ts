import { PoloniexOrderTypeEnum } from '../enums/PoloniexOrderTypeEnum'



export interface IPoloniexOrderInfo {
  orderNumber: string
  type: PoloniexOrderTypeEnum
  rate: string
  startingAmount: string
  amount: string
  total: string
  date: string
  margin: number
  clientOrderId: string
}

export interface IPoloniexOrderSchema extends IPoloniexOrderInfo {
  currencyPair: string
  baseCurrency: string
  quoteCurrency: string
}

export interface IPoloniexOrderResponseSchema {
  [key: string]: IPoloniexOrderInfo[]
}
