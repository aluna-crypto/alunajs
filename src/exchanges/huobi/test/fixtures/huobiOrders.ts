import { HuobiConditionalOrderTypeEnum } from '../../enums/HuobiConditionalOrderTypeEnum'
import { HuobiOrderSideEnum } from '../../enums/HuobiOrderSideEnum'
import { HuobiOrderStatusEnum } from '../../enums/HuobiOrderStatusEnum'
import { IHuobiOrderSchema, IHuobiOrderTriggerSchema } from '../../schemas/IHuobiOrderSchema'



// TODO: Review fixtures
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
    type: 'sell-limit',
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
    type: 'buy-market',
    'client-order-is': '1234',
  },
]

export const HUOBI_RAW_CONDITIONAL_ORDERS: IHuobiOrderTriggerSchema[] = [
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
    orderType: HuobiConditionalOrderTypeEnum.LIMIT,
    orderPrice: '27000',
    orderSize: '1',
    orderStatus: 'created',
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
    orderType: HuobiConditionalOrderTypeEnum.MARKET,
    orderPrice: '31598',
    orderSize: '1',
    orderStatus: 'created',
  },

]
