import { BinanceOrderSideEnum } from '../../enums/BinanceOrderSideEnum'
import { BinanceOrderStatusEnum } from '../../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../../enums/BinanceOrderTypeEnum'
import { IBinanceOrderSchema } from '../../schemas/IBinanceOrderSchema'



// TODO: Review fixtures
export const BINANCE_RAW_ORDERS: IBinanceOrderSchema[] = [
  {
    symbol: 'ETHBTC',
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
    side: BinanceOrderSideEnum.BUY,
    stopPrice: '0.0',
    icebergQty: '0.0',
    time: 1499827319559,
    updateTime: 1499827319559,
    isWorking: true,
    origQuoteOrderQty: '0.000000',
  },
  {
    symbol: 'BTCBRL',
    orderId: 29383586,
    orderListId: -1,
    clientOrderId: '46RtpeZf1UIjLpOIFaelrz',
    transactTime: 1645010853101,
    price: '0.00000000',
    origQty: '4.00000000',
    executedQty: '4.00000000',
    cummulativeQuoteQty: '20.75200000',
    status: BinanceOrderStatusEnum.FILLED,
    timeInForce: 'GTC',
    type: BinanceOrderTypeEnum.MARKET,
    side: BinanceOrderSideEnum.BUY,
    fills: [
      {
        price: '5.18800000',
        qty: '4.00000000',
        commission: '0.00400000',
        commissionAsset: 'BTCBRL',
        tradeId: 6683951,
      },
    ],
  },
]
