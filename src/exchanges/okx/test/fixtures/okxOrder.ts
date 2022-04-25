import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { OkxOrderStatusEnum } from '../../enums/OkxOrderStatusEnum'
import { OkxOrderTypeEnum } from '../../enums/OkxOrderTypeEnum'
import { OkxSideEnum } from '../../enums/OkxSideEnum'
import { IOkxOrderSchema } from '../../schemas/IOkxOrderSchema'



export const OKX_RAW_ORDER: IOkxOrderSchema = {
  instType: 'SPOT',
  instId: 'BTC-USD',
  ccy: 'BTC',
  ordId: '312269865356374016',
  clOrdId: 'b1',
  tag: '',
  px: '999',
  sz: '3',
  pnl: '5',
  ordType: OkxOrderTypeEnum.LIMIT,
  side: OkxSideEnum.LONG,
  posSide: 'long',
  tdMode: 'isolated',
  accFillSz: '0',
  fillPx: '0',
  tradeId: '0',
  fillSz: '0',
  fillTime: '0',
  state: OkxOrderStatusEnum.LIVE,
  avgPx: '0',
  lever: '20',
  tpTriggerPx: '',
  tpTriggerPxType: 'last',
  tpOrdPx: '',
  slTriggerPx: '',
  slTriggerPxType: 'last',
  slOrdPx: '',
  feeCcy: '',
  fee: '',
  rebateCcy: '',
  rebate: '',
  tgtCcy: 'USD',
  category: '',
  uTime: '1597026383085',
  cTime: '1597026383085',
}

export const OKX_PARSED_ORDER: IAlunaOrderSchema = {
  id: '312269865356374016',
  symbolPair: 'BTC-USD',
  total: 2997,
  amount: 3,
  rate: 999,
  exchangeId: 'okx',
  baseSymbolId: 'BTC',
  quoteSymbolId: 'USD',
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaOrderSideEnum.BUY,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('2020-08-10T02:26:23.085Z'),
  filledAt: undefined,
  canceledAt: undefined,
  meta: {},
}
