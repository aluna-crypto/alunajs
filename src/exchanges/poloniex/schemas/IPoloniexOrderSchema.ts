import { PoloniexOrderStatusEnum } from '../enums/PoloniexOrderStatusEnum'
import { PoloniexOrderTypeEnum } from '../enums/PoloniexOrderTypeEnum'



export interface IPoloniexOrderResponseReturns<T> {
  requestCount: number
  order: T
}

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

export interface IPoloniexOrderStatusInfo extends IPoloniexOrderInfo {
  status: PoloniexOrderStatusEnum
  currencyPair: string
}

export interface IPoloniexOrderWithCurrency extends IPoloniexOrderInfo {
  currencyPair: string
  baseCurrency: string
  quoteCurrency: string
}

export interface IPoloniexOrderSchema {
  [key: string]: IPoloniexOrderInfo[]
}

export interface IPoloniexOrderStatusSchema {
  result: {
    [key: string]: IPoloniexOrderStatusInfo,
  }
}


export interface IPoloniexOrderErrorResultSchema {
  result: { error: string }
}

export interface IPoloniexOrderResponse {
  orderNumber: string
  resultingTrades: IPoloniexOrderInfo[]
  fee: string
  clientOrderId: string
  currencyPair: string
}

export interface IPoloniexOrderCanceledResponse {
  success: number
  amount: string
  clientOrderId: string
  message: string
}

export type getOrderStatusResponse =
IPoloniexOrderStatusSchema | IPoloniexOrderErrorResultSchema
