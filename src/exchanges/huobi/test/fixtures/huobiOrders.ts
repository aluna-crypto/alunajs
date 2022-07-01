import { HuobiOrderSideEnum } from '../../enums/HuobiOrderSideEnum'
import { HuobiOrderStatusEnum } from '../../enums/HuobiOrderStatusEnum'
import { HuobiOrderTypeEnum } from '../../enums/HuobiOrderTypeEnum'
import {
  IHuobiConditionalOrderSchema,
  IHuobiOrderSchema,
} from '../../schemas/IHuobiOrderSchema'



export const HUOBI_RAW_ORDERS: IHuobiOrderSchema[] = [
  {
    symbol: 'ethusdt',
    source: 'web',
    price: '1.555550000000000000',
    'created-at': 1630633835224,
    amount: '572.330000000000000000',
    'account-id': 13496526,
    'filled-cash-amount': '0.0',
    'filled-amount': '0.0',
    'filled-fees': '0.0',
    id: 357630527817871,
    state: HuobiOrderStatusEnum.CANCELED,
    type: HuobiOrderTypeEnum.SELL_LIMIT,
    'client-order-is': '1234',
  },
  {
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
    state: HuobiOrderStatusEnum.FILLED,
    type: HuobiOrderTypeEnum.BUY_MARKET,
    'client-order-is': '1234',
  },
]

export const HUOBI_RAW_CONDITIONAL_ORDERS: IHuobiConditionalOrderSchema[] = [
  {
    orderOrigTime: 1654648192646,
    lastActTime: 1654648192669,
    symbol: 'btcusdt',
    source: 'api',
    timeInForce: 'gtc',
    stopPrice: '25000',
    accountId: 49160295,
    clientOrderId: 'carrodemalandro',
    orderSide: HuobiOrderSideEnum.BUY,
    orderType: HuobiOrderTypeEnum.STOP_LIMIT,
    orderPrice: '27000',
    orderSize: '1',
    orderStatus: HuobiOrderStatusEnum.CANCELED,
  },
  {
    orderOrigTime: 1654648192646,
    lastActTime: 1654648192669,
    symbol: 'btcusdt',
    source: 'api',
    timeInForce: 'gtc',
    stopPrice: '25000',
    accountId: 49160295,
    clientOrderId: 'comedianaotemcarona',
    orderSide: HuobiOrderSideEnum.BUY,
    orderType: HuobiOrderTypeEnum.STOP_MARKET,
    orderPrice: '31598',
    orderSize: '1',
    orderStatus: HuobiOrderStatusEnum.FILLED,
  },

]
