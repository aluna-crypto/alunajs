import { GateioOrderStatusEnum } from '../enums/GateioOrderStatusEnum'
import { GateioOrderTimeInForceEnum } from '../enums/GateioOrderTimeInForceEnum'
import { GateioOrderTypeEnum } from '../enums/GateioOrderTypeEnum'
import { GateioSideEnum } from '../enums/GateioSideEnum'



export interface IGateioOrderSchema {
  id: string
  text: string
  create_time: string
  update_time: string
  create_time_ms: number
  update_time_ms: number
  currency_pair: string
  status: GateioOrderStatusEnum
  type: GateioOrderTypeEnum
  account: string
  side: GateioSideEnum
  iceberg: string
  amount: string
  price: string
  time_in_force: GateioOrderTimeInForceEnum
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
}

export interface IGateioOrderListResponseSchema {
  currency_pair: string
  total: number
  orders: IGateioOrderSchema[]
}
