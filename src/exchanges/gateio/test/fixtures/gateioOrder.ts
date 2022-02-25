import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { GateioOrderStatusEnum } from '../../enums/GateioOrderStatusEnum'
import { GateioOrderTimeInForceEnum } from '../../enums/GateioOrderTimeInForceEnum'
import { GateioOrderTypeEnum } from '../../enums/GateioOrderTypeEnum'
import { GateioSideEnum } from '../../enums/GateioSideEnum'
import { IGateioOrderSchema } from '../../schemas/IGateioOrderSchema'



export const GATEIO_RAW_ORDER: IGateioOrderSchema = {
  id: '124084530741',
  text: '3',
  create_time: '1644845927',
  update_time: '1644845927',
  create_time_ms: 1644845927564,
  update_time_ms: 1644845927564,
  status: GateioOrderStatusEnum.OPEN,
  currency_pair: 'BNB_USDT',
  type: GateioOrderTypeEnum.LIMIT,
  account: 'spot',
  side: GateioSideEnum.SELL,
  amount: '0.02',
  price: '600',
  time_in_force: GateioOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
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
}

export const GATEIO_PARSED_ORDER = {
  id: '124084530741',
  symbolPair: 'BNB_USDT',
  total: 12,
  amount: 0.02,
  rate: 600,
  exchangeId: 'gateio',
  baseSymbolId: 'BNB',
  quoteSymbolId: 'USDT',
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaSideEnum.SHORT,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2022-02-14T13:38:47.566Z'),
  meta: {},
}
