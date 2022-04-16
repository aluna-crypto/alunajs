import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { HuobiOrderStatusEnum } from '../../enums/HuobiOrderStatusEnum'
import { IHuobiOrderSchema } from '../../schemas/IHuobiOrderSchema'



export const HUOBI_RAW_ORDER: IHuobiOrderSchema = {
  symbol: 'btcusdt',
  source: 'web',
  price: '1.555550000000000000',
  'created-at': 1630633835224,
  amount: '572.330000000000000000',
  'account-id': 13496526,
  'filled-cash-amount': '0.0',
  'filled-amount': '0.0',
  'filled-fees': '0.0',
  id: 357630527817871,
  state: HuobiOrderStatusEnum.CREATED,
  type: 'sell-limit',
  'client-order-is': '1234',
}

export const HUOBI_PARSED_ORDER: IAlunaOrderSchema = {
  id: 357630527817871,
  symbolPair: 'btcusdt',
  total: 890.2879315,
  amount: 572.33,
  rate: 1.55555,
  exchangeId: 'huobi',
  baseSymbolId: 'btc',
  quoteSymbolId: 'usdt',
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaOrderSideEnum.SELL,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2021-09-03T01:50:35.224Z'),
  filledAt: undefined,
  canceledAt: undefined,
  meta: {},
}
