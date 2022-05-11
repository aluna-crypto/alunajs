import { GateOrderSideEnum } from '../../enums/GateOrderSideEnum'
import { GateOrderStatusEnum } from '../../enums/GateOrderStatusEnum'
import { GateOrderTimeInForceEnum } from '../../enums/GateOrderTimeInForceEnum'
import { GateOrderTypeEnum } from '../../enums/GateOrderTypeEnum'
import { IGateOrderSchema } from '../../schemas/IGateOrderSchema'



// TODO: Review fixtures
export const GATE_RAW_ORDERS: IGateOrderSchema[] = [
  {
    id: '124084530741',
    text: '3',
    create_time: '1644845927',
    update_time: '1644845927',
    create_time_ms: 1644845927564,
    update_time_ms: 1644845927564,
    status: GateOrderStatusEnum.OPEN,
    currency_pair: 'BNB_USDT',
    type: GateOrderTypeEnum.LIMIT,
    account: 'spot',
    side: GateOrderSideEnum.SELL,
    amount: '0.02',
    price: '600',
    time_in_force: GateOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    iceberg: '0',
    left: '0.02',
    fill_price: '0',
    filled_total: '0',
    fee: '0',
    fee_currency: 'USDT',
    point_fee: '0',
    gt_fee: '0',
    gt_discount: false,
    rebated_fee: '0',
    rebated_fee_currency: 'BNB',
  },
  {
    id: '124084530743',
    text: '3',
    create_time: '1644845927',
    update_time: '1644845927',
    create_time_ms: 1644845927564,
    update_time_ms: 1644845927564,
    status: GateOrderStatusEnum.CLOSED,
    currency_pair: 'BNB_USDT',
    type: GateOrderTypeEnum.LIMIT,
    account: 'spot',
    side: GateOrderSideEnum.SELL,
    amount: '0.02',
    price: '600',
    time_in_force: GateOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    iceberg: '0',
    left: '0.02',
    fill_price: '0',
    filled_total: '0',
    fee: '0',
    fee_currency: 'USDT',
    point_fee: '0',
    gt_fee: '0',
    gt_discount: false,
    rebated_fee: '0',
    rebated_fee_currency: 'BNB',
  },
]

