import {
  AlunaAccountEnum,
  AlunaOrderStatusEnum,
  AlunaOrderTypesEnum,
  AlunaSideEnum,
  IAlunaOrderSchema,
} from '../../../../index'
import { BittrexOrderStatusEnum } from '../../enums/BittrexOrderStatusEnum'
import { BittrexOrderTimeInForceEnum } from '../../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../../enums/BittrexSideEnum'
import { IBittrexOrderSchema } from '../../schemas/IBittrexOrderSchema'



export const BITTREX_RAW_LIMIT_ORDER: IBittrexOrderSchema = {
  id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
  marketSymbol: 'BTC-EUR',
  direction: BittrexSideEnum.BUY,
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
}

export const BITTREX_RAW_MARKET_ORDER: IBittrexOrderSchema = {
  id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
  marketSymbol: 'BTC-EUR',
  direction: BittrexSideEnum.BUY,
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
}

export const BITTREX_PARSED_ORDER: IAlunaOrderSchema = {
  id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
  symbolPair: 'USDT-USD',
  total: 12.5000417603292,
  amount: 9.94497801,
  rate: 1.25692,
  exchangeId: 'bittrex',
  baseSymbolId: 'USDT',
  quoteSymbolId: 'USD',
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaSideEnum.LONG,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2015-12-11T06:31:40.633Z'),
  meta: {},
}
