import { BittrexOrderSideEnum } from '../../enums/BittrexOrderSideEnum'
import { BittrexOrderStatusEnum } from '../../enums/BittrexOrderStatusEnum'
import { BittrexOrderTimeInForceEnum } from '../../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../../enums/BittrexOrderTypeEnum'
import { IBittrexOrderSchema } from '../../schemas/IBittrexOrderSchema'



export const BITTREX_RAW_ORDERS: IBittrexOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    marketSymbol: 'BTC-EUR',
    direction: BittrexOrderSideEnum.BUY,
    type: BittrexOrderTypeEnum.LIMIT,
    quantity: '9.94497801',
    limit: '1.25692000',
    ceiling: '10.00000000',
    timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    clientOrderId: 'string',
    fillQuantity: '9.94497801',
    commission: '0.00000000',
    proceeds: '10.00000000',
    status: BittrexOrderStatusEnum.OPEN,
    createdAt: '2015-12-11T06:31:40.633Z',
    updatedAt: '2015-12-11T06:31:40.633Z',
    closedAt: '2015-12-11T06:31:40.633Z',
    orderToCancel: {
      id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
      type: BittrexOrderTypeEnum.LIMIT,
    },
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    marketSymbol: 'BTC-EUR',
    direction: BittrexOrderSideEnum.BUY,
    type: BittrexOrderTypeEnum.MARKET,
    quantity: '9.94497801',
    ceiling: '10.00000000',
    limit: null as any,
    timeInForce: BittrexOrderTimeInForceEnum.FILL_OR_KILL,
    clientOrderId: 'string',
    fillQuantity: '9',
    commission: '0.00000000',
    proceeds: '10.00000000',
    status: BittrexOrderStatusEnum.CLOSED,
    createdAt: '2015-12-11T06:31:40.633Z',
    updatedAt: '2015-12-11T06:31:40.633Z',
    closedAt: '2015-12-11T06:31:40.633Z',
    orderToCancel: {
      id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
      type: BittrexOrderTypeEnum.MARKET,
    },
  },
]



export const BITTREX_RAW_CLOSED_ORDER = {
  id: '8bc1e59c-77fa-4554-bd11-966e360e4eb5',
  marketSymbol: 'BTC-EUR',
  direction: BittrexOrderSideEnum.BUY,
  type: BittrexOrderTypeEnum.LIMIT,
  quantity: '9.94497801',
  limit: null as any,
  ceiling: '10.00000000',
  timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
  clientOrderId: 'string',
  fillQuantity: '9.94497801',
  commission: '0.00000000',
  proceeds: '10.00000000',
  status: BittrexOrderStatusEnum.CLOSED,
  createdAt: '2015-12-11T06:31:40.633Z',
  updatedAt: '2015-12-11T06:31:40.633Z',
  closedAt: '2015-12-11T06:31:40.633Z',
  orderToCancel: {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    type: BittrexOrderTypeEnum.LIMIT,
  },
}
