import {
  AlunaAccountEnum,
  AlunaOrderStatusEnum,
  AlunaOrderTypesEnum,
  AlunaSideEnum,
  IAlunaOrderSchema,
} from '../../../../index'
import { Binance } from '../../Binance'
import { BinanceOrderStatusEnum } from '../../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../../enums/BinanceSideEnum'
import { IBinanceOrderSchema } from '../../schemas/IBinanceOrderSchema'



export const BINANCE_RAW_ORDER: IBinanceOrderSchema = {
  symbol: 'LTCBTC',
  orderId: 1,
  orderListId: -1,
  clientOrderId: 'myOrder1',
  price: '0.1',
  origQty: '1.0',
  executedQty: '0.0',
  cummulativeQuoteQty: '0.0',
  status: BinanceOrderStatusEnum.NEW,
  timeInForce: 'GTC',
  type: BinanceOrderTypeEnum.LIMIT,
  side: BinanceSideEnum.BUY,
  stopPrice: '0.0',
  icebergQty: '0.0',
  time: 1499827319559,
  updateTime: 1499827319559,
  isWorking: true,
  origQuoteOrderQty: '0.000000',
}

export const BINANCE_PARSED_ORDER: IAlunaOrderSchema = {
  id: 1,
  symbolPair: 'LTCBTC',
  baseSymbolId: 'LTC',
  exchangeId: Binance.ID,
  quoteSymbolId: 'BTC',
  total: 0.1,
  amount: 1,
  rate: 0.1,
  account: AlunaAccountEnum.EXCHANGE,
  side: AlunaSideEnum.LONG,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('+049497-08-20T11:52:39.000Z'),
  meta: {},
}
