import { AccountEnum } from '../../../../../lib/enums/AccountEnum'
import { OrderStatusEnum } from '../../../../../lib/enums/OrderStatusEnum'
import { OrderTypesEnum } from '../../../../../lib/enums/OrderTypeEnum'
import { SideEnum } from '../../../../../lib/enums/SideEnum'
import { IAlunaOrderSchema } from '../../../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../../../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../../../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../../../enums/ValrSideEnum'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../../../schemas/IValrOrderSchema'



export const VALR_RAW_LIST_OPEN_ORDERS: IValrOrderListSchema[] = [
  {
    orderId: 'e5e92066-b230-4389-b9d2-f56d826f1066',
    side: ValrSideEnum.BUY,
    remainingQuantity: '0.001',
    price: '12000',
    currencyPair: 'ETHZAR',
    createdAt: '2021-06-08T00:55:12.982Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    stopPrice: '10000',
    updatedAt: '2021-06-08T00:55:12.984Z',
    status: ValrOrderStatusEnum.ACTIVE,
    type: ValrOrderTypesEnum.TAKE_PROFIT_LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: 'eb47c14b-94f0-4358-a732-6f9bd70f12d6',
    side: ValrSideEnum.BUY,
    remainingQuantity: '0.001',
    price: '10000',
    currencyPair: 'BTCZAR',
    createdAt: '2021-06-08T01:47:50.350Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    updatedAt: '2021-06-08T01:47:50.351Z',
    status: ValrOrderStatusEnum.PLACED,
    type: ValrOrderTypesEnum.LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: '9481397e-ca83-4e66-af30-c9afeba35106',
    side: ValrSideEnum.SELL,
    remainingQuantity: '0.001',
    price: '80000',
    currencyPair: 'ETHZAR',
    createdAt: '2021-06-08T01:49:08.173Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    updatedAt: '2021-06-08T01:49:08.175Z',
    status: ValrOrderStatusEnum.PLACED,
    type: ValrOrderTypesEnum.LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: 'efcb70c1-23a4-47e9-978b-0d3a9add616e',
    side: ValrSideEnum.SELL,
    remainingQuantity: '0.001',
    price: '50000',
    currencyPair: 'ETHZAR',
    createdAt: '2021-06-08T01:51:43.960Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    stopPrice: '32000',
    updatedAt: '2021-06-08T01:51:43.961Z',
    status: ValrOrderStatusEnum.ACTIVE,
    type: ValrOrderTypesEnum.STOP_LOSS_LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
]



export const VALR_RAW_GET_ORDERS: IValrOrderGetSchema[] = [
  {
    orderId: 'e5e92066-b230-4389-b9d2-f56d826f1066',
    orderStatusType: ValrOrderStatusEnum.ACTIVE,
    currencyPair: 'ETHZAR',
    originalPrice: '12000',
    remainingQuantity: '0.001',
    originalQuantity: '0.001',
    orderSide: ValrSideEnum.BUY,
    orderType: ValrOrderTypesEnum.TAKE_PROFIT_LIMIT,
    failedReason: '',
    customerOrderId: '',
    orderCreatedAt: '2021-06-08T00:55:12.982Z',
    orderUpdatedAt: '2021-06-08T00:55:12.984Z',
  },
  {
    orderId: 'f6d69359-cd93-443c-b584-42b669508424',
    orderStatusType: ValrOrderStatusEnum.PLACED,
    currencyPair: 'ETHZAR',
    originalPrice: '10000',
    remainingQuantity: '0.001',
    originalQuantity: '0.001',
    orderSide: ValrSideEnum.BUY,
    orderType: ValrOrderTypesEnum.LIMIT,
    failedReason: '',
    orderUpdatedAt: '2021-06-09T12:34:58.838Z',
    orderCreatedAt: '2021-06-09T12:34:58.836Z',
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },

]



export const VALR_PARSED_OPEN_ORDERS: IAlunaOrderSchema[] = [
  {
    id: 'e5e92066-b230-4389-b9d2-f56d826f1066',
    symbolPair: 'ETHZAR',
    total: 12,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 12000,
    account: AccountEnum.EXCHANGE,
    side: SideEnum.LONG,
    status: OrderStatusEnum.OPEN,
    type: OrderTypesEnum.TAKE_PROFIT_LIMIT,
    placedAt: new Date('2021-06-08T00:55:12.982Z'),
  },
  {
    id: 'eb47c14b-94f0-4358-a732-6f9bd70f12d6',
    symbolPair: 'BTCZAR',
    total: 10,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 10000,
    account: AccountEnum.EXCHANGE,
    side: SideEnum.LONG,
    status: OrderStatusEnum.OPEN,
    type: OrderTypesEnum.LIMIT,
    placedAt: new Date('2021-06-08T01:47:50.350Z'),
  },
  {
    id: '9481397e-ca83-4e66-af30-c9afeba35106',
    symbolPair: 'ETHZAR',
    total: 80,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 80000,
    account: AccountEnum.EXCHANGE,
    side: SideEnum.SHORT,
    status: OrderStatusEnum.OPEN,
    type: OrderTypesEnum.LIMIT,
    placedAt: new Date('2021-06-08T01:49:08.173Z'),
  },
  {
    id: 'efcb70c1-23a4-47e9-978b-0d3a9add616e',
    symbolPair: 'ETHZAR',
    total: 50,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 50000,
    account: AccountEnum.EXCHANGE,
    side: SideEnum.SHORT,
    status: OrderStatusEnum.OPEN,
    type: OrderTypesEnum.STOP_LIMIT,
    placedAt: new Date('2021-06-08T01:51:43.960Z'),
  },
]

