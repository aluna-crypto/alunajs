import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { SampleOrderStatusEnum } from '../../enums/SampleOrderStatusEnum'
import { SampleOrderTimeInForceEnum } from '../../enums/SampleOrderTimeInForceEnum'
import { SampleOrderTypeEnum } from '../../enums/SampleOrderTypeEnum'
import { SampleSideEnum } from '../../enums/SampleSideEnum'
import { ISampleOrderSchema } from '../../schemas/ISampleOrderSchema'



export const SAMPLE_RAW_ORDERS: ISampleOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    marketSymbol: 'BTC-EUR',
    direction: SampleSideEnum.BUY,
    type: SampleOrderTypeEnum.LIMIT,
    quantity: '9.94497801',
    limit: '1.25692000',
    ceiling: '10.00000000',
    timeInForce: SampleOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
    clientOrderId: 'string',
    fillQuantity: '9.94497801',
    commission: '0.00000000',
    proceeds: '10.00000000',
    status: SampleOrderStatusEnum.OPEN,
    createdAt: '2015-12-11T06:31:40.633Z',
    updatedAt: '2015-12-11T06:31:40.633Z',
    closedAt: '2015-12-11T06:31:40.633Z',
    orderToCancel: {
      id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
      type: SampleOrderTypeEnum.LIMIT,
    },
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    marketSymbol: 'BTC-EUR',
    direction: SampleSideEnum.BUY,
    type: SampleOrderTypeEnum.MARKET,
    quantity: '9.94497801',
    ceiling: '10.00000000',
    limit: null as any,
    timeInForce: SampleOrderTimeInForceEnum.FILL_OR_KILL,
    clientOrderId: 'string',
    fillQuantity: '9',
    commission: '0.00000000',
    proceeds: '10.00000000',
    status: SampleOrderStatusEnum.CLOSED,
    createdAt: '2015-12-11T06:31:40.633Z',
    updatedAt: '2015-12-11T06:31:40.633Z',
    closedAt: '2015-12-11T06:31:40.633Z',
    orderToCancel: {
      id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
      type: SampleOrderTypeEnum.MARKET,
    },
  },
]



export const SAMPLE_RAW_CLOSED_ORDER = {
  id: '8bc1e59c-77fa-4554-bd11-966e360e4eb5',
  marketSymbol: 'BTC-EUR',
  direction: SampleSideEnum.BUY,
  type: SampleOrderTypeEnum.LIMIT,
  quantity: '9.94497801',
  limit: null as any,
  ceiling: '10.00000000',
  timeInForce: SampleOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
  clientOrderId: 'string',
  fillQuantity: '9.94497801',
  commission: '0.00000000',
  proceeds: '10.00000000',
  status: SampleOrderStatusEnum.CLOSED,
  createdAt: '2015-12-11T06:31:40.633Z',
  updatedAt: '2015-12-11T06:31:40.633Z',
  closedAt: '2015-12-11T06:31:40.633Z',
  orderToCancel: {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    type: SampleOrderTypeEnum.LIMIT,
  },
}



export const SAMPLE_PARSED_ORDERS: IAlunaOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbolPair: 'USDT-USD',
    total: 12.5000417603292,
    amount: 9.94497801,
    rate: 1.25692,
    exchangeId: 'sample',
    baseSymbolId: 'USDT',
    quoteSymbolId: 'USD',
    account: AlunaAccountEnum.EXCHANGE,
    side: AlunaOrderSideEnum.BUY,
    status: AlunaOrderStatusEnum.OPEN,
    type: AlunaOrderTypesEnum.LIMIT,
    placedAt: new Date('2015-12-11T06:31:40.633Z'),
    meta: {},
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbolPair: 'USDT-USD',
    total: 12.5000417603292,
    amount: 9.94497801,
    rate: 1.25692,
    exchangeId: 'sample',
    baseSymbolId: 'USDT',
    quoteSymbolId: 'USD',
    account: AlunaAccountEnum.EXCHANGE,
    side: AlunaOrderSideEnum.BUY,
    status: AlunaOrderStatusEnum.FILLED,
    type: AlunaOrderTypesEnum.MARKET,
    placedAt: new Date('2015-12-11T06:31:40.633Z'),
    meta: {},
  },
]
