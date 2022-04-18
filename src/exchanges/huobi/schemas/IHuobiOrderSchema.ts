import { HuobiOrderStatusEnum } from '../enums/HuobiOrderStatusEnum'



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
}

export interface IHuobiOrderRequest {
  'account-id': string
  amount: string
  price?: string
  source: string
  symbol: string
  type: string
}
