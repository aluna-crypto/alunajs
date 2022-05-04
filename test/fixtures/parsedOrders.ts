import { AlunaAccountEnum } from '../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../src/lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../src/lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../src/lib/schemas/IAlunaOrderSchema'



export const PARSED_ORDERS: IAlunaOrderSchema[] = [
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
