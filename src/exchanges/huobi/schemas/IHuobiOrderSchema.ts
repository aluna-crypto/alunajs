import { HuobiConditionalOrderStatusEnum } from '../enums/HuobiConditionalOrderStatusEnum'
import { HuobiConditionalOrderTypeEnum } from '../enums/HuobiConditionalOrderTypeEnum'
import { HuobiOrderSideEnum } from '../enums/HuobiOrderSideEnum'
import { HuobiOrderStatusEnum } from '../enums/HuobiOrderStatusEnum'
import { IHuobiSymbolSchema } from './IHuobiSymbolSchema'



export interface IHuobiOrderSchema {
  symbol: string
  source: string
  price: string
  'created-at': number
  amount: string
  'account-id': number
  'filled-cash-amount': string
  'client-order-is': string
  'filled-amount': string
  'filled-fees': string
  id: number
  state: HuobiOrderStatusEnum
  type: string
  'stop-price'?: string
}

export interface IHuobiOrderTriggerSchema {
  lastActTime: number
  orderOrigTime: number
  symbol: string
  source: string
  clientOrderId: string
  orderSide: HuobiOrderSideEnum
  orderType: HuobiConditionalOrderTypeEnum
  orderPrice: string
  orderSize: string
  accountId: number
  timeInForce: string
  stopPrice: string
  orderStatus: HuobiConditionalOrderStatusEnum
}

export interface IHuobiOrdersResponseSchema {
  rawOrders: (IHuobiOrderSchema | IHuobiOrderTriggerSchema)[]
  rawSymbols: IHuobiSymbolSchema[]
}

export interface IHuobiOrderResponseSchema {
  rawOrder: IHuobiOrderSchema | IHuobiOrderTriggerSchema
  rawSymbol: IHuobiSymbolSchema
}

export interface IHuobiOrderPriceFieldsSchema {
  limitRate?: number
  rate?: number
  stopRate?: number
  total: number
}
