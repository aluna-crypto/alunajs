import { HuobiOrderSideEnum } from '../enums/HuobiOrderSideEnum'
import { HuobiOrderStatusEnum } from '../enums/HuobiOrderStatusEnum'
import { HuobiOrderTypeEnum } from '../enums/HuobiOrderTypeEnum'
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
  type: HuobiOrderTypeEnum
  'stop-price'?: string
}

export interface IHuobiConditionalOrderSchema {
  lastActTime: number
  orderOrigTime: number
  symbol: string
  source: string
  clientOrderId: string
  orderSide: HuobiOrderSideEnum
  orderType: HuobiOrderTypeEnum
  orderPrice: string
  orderSize: string
  accountId: number
  timeInForce: string
  orderValue?: string
  stopPrice: string
  orderStatus: HuobiOrderStatusEnum
}

export interface IHuobiOrdersResponseSchema {
  huobiOrders: (IHuobiOrderSchema | IHuobiConditionalOrderSchema)[]
  rawSymbols: IHuobiSymbolSchema[]
}

export interface IHuobiOrderResponseSchema {
  huobiOrder: IHuobiOrderSchema | IHuobiConditionalOrderSchema
  rawSymbol: IHuobiSymbolSchema
}

export interface IHuobiOrderPriceFieldsSchema {
  limitRate?: number
  rate?: number
  stopRate?: number
  total: number
}
