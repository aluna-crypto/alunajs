import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
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

export const BINANCE_RAW_MARKET_ORDER: IBinanceOrderSchema = {
  symbol: 'LTCBTC',
  orderId: 29383586,
  orderListId: -1,
  clientOrderId: '46RtpeZf1UIjLpOIFaelrz',
  transactTime: 1645010853101,
  price: '0.00000000',
  origQty: '4.00000000',
  executedQty: '4.00000000',
  cummulativeQuoteQty: '20.75200000',
  status: 'FILLED' as BinanceOrderStatusEnum,
  timeInForce: 'GTC',
  type: BinanceOrderTypeEnum.MARKET,
  side: BinanceSideEnum.BUY,
  fills: [
    {
      price: '5.18800000',
      qty: '4.00000000',
      commission: '0.00400000',
      commissionAsset: 'LTCBTC',
      tradeId: 6683951,
    },
  ],
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
  side: AlunaOrderSideEnum.BUY,
  status: AlunaOrderStatusEnum.OPEN,
  type: AlunaOrderTypesEnum.LIMIT,
  placedAt: new Date('+049497-08-20T11:52:39.000Z'),
  meta: {},
}
