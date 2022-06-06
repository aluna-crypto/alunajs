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

export interface IHuobiOrdersResponseSchema {
  rawOrders: IHuobiOrderSchema[]
  rawSymbols: IHuobiSymbolSchema[]
}

export interface IHuobiOrderResponseSchema {
  rawOrder: IHuobiOrderSchema
  rawSymbol: IHuobiSymbolSchema
}

export interface IHuobiOrderPriceFieldsSchema {
  limitRate?: number
  rate?: number
  stopRate?: number
  total: number
}
