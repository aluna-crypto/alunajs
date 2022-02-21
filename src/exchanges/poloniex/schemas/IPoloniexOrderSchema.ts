import { PoloniexOrderStatusEnum } from '../enums/PoloniexOrderStatusEnum'
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

export interface IPoloniexOrderStatusInfo extends IPoloniexOrderInfo {
  status: PoloniexOrderStatusEnum
  currencyPair: string
}

export interface IPoloniexOrderSchema {
  [key: string]: IPoloniexOrderInfo[]
}

export interface IPoloniexOrderStatusSchema {
  result: {
    [key: string]: IPoloniexOrderStatusInfo,
  }
}

export interface IPoloniexOrderWithCurrency extends IPoloniexOrderInfo {
  currencyPair: string
}
