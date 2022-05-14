import { PoloniexOrderStatusEnum } from '../../enums/PoloniexOrderStatusEnum'
import { PoloniexOrderTypeEnum } from '../../enums/PoloniexOrderTypeEnum'
import {
  IPoloniexOrderInfo,
  IPoloniexOrderResponseSchema,
  IPoloniexOrderSchema,
  IPoloniexOrderStatusInfoSchema,
} from '../../schemas/IPoloniexOrderSchema'



export const POLONIEX_RAW_ORDER_INFO: IPoloniexOrderInfo[] = [
  {
    orderNumber: '3810998527',
    type: PoloniexOrderTypeEnum.SELL,
    rate: '500.00000000',
    startingAmount: '0.00500000',
    amount: '0.00500000',
    total: '2.50000000',
    date: '2022-02-21 13:48:46',
    margin: 0,
    clientOrderId: '1234',
  },
]

export const POLONIEX_RAW_ORDER_STATUS_INFO: IPoloniexOrderStatusInfoSchema[] = [
  {
    orderNumber: '3810998527',
    type: PoloniexOrderTypeEnum.SELL,
    rate: '500.00000000',
    startingAmount: '0.00500000',
    amount: '0.00500000',
    total: '2.50000000',
    date: '2022-02-21 13:48:46',
    margin: 0,
    clientOrderId: '1234',
    currencyPair: 'BUSD_BNB',
    status: PoloniexOrderStatusEnum.FILLED,
  },
]

export const POLONIEX_RAW_ORDERS_RESPONSE: IPoloniexOrderResponseSchema = {
  BUSD_BNB: POLONIEX_RAW_ORDER_INFO,
}

export const POLONIEX_RAW_ORDERS: IPoloniexOrderSchema[] = [
  {
    ...POLONIEX_RAW_ORDER_INFO[0],
    currencyPair: 'BUSD_BNB',
    baseCurrency: 'BUSD',
    quoteCurrency: 'BNB',
  },
]
