import { GateOrderSideEnum } from '../enums/GateOrderSideEnum'
import { GateOrderStatusEnum } from '../enums/GateOrderStatusEnum'
import { GateOrderTimeInForceEnum } from '../enums/GateOrderTimeInForceEnum'
import { GateOrderTypeEnum } from '../enums/GateOrderTypeEnum'



export interface IGateOrderSchema {

  /* eslint-disable camelcase */
  id: string
  text: string
  create_time: string
  update_time: string
  create_time_ms: number
  update_time_ms: number
  currency_pair: string
  status: GateOrderStatusEnum
  type: GateOrderTypeEnum
  account: string
  side: GateOrderSideEnum
  iceberg: string
  amount: string
  price: string
  time_in_force: GateOrderTimeInForceEnum
  left: string
  filled_total: string
  fee: string
  fee_currency: string
  point_fee: string
  gt_fee: string
  gt_discount: boolean
  rebated_fee: string
  rebated_fee_currency: string
  fill_price: string
  /* eslint-disable camelcase */

}

export interface IGateOrderListResponseSchema {

  /* eslint-disable camelcase */
  currency_pair: string
  total: number
  orders: IGateOrderSchema[]
  /* eslint-disable camelcase */

}
