import { BittrexOrderStatusEnum } from '../enums/BittrexOrderStatusEnum'
import { BittrexOrderTimeInForceEnum } from '../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../enums/BittrexOrderTypeEnum'
import { BittrexSideEnum } from '../enums/BittrexSideEnum'



export interface IBittrexOrderToCancel {
    type: BittrexOrderTypeEnum
    id: string
}

export interface IBittrexOrderSchema {
    id: string
    marketSymbol: string
    direction: BittrexSideEnum
    type: BittrexOrderTypeEnum
    quantity: string
    limit: string
    ceiling: string
    timeInForce: BittrexOrderTimeInForceEnum
    clientOrderId: string
    fillQuantity: string
    commission: string
    proceeds: string
    status: BittrexOrderStatusEnum
    createdAt: string
    updatedAt: string
    closedAt: string
    orderToCancel: IBittrexOrderToCancel
}

export interface IBittrexOrderRequest {
    marketSymbol: string
    direction: BittrexSideEnum
    type: BittrexOrderTypeEnum
    quantity: number
    limit?: number
    timeInForce?: BittrexOrderTimeInForceEnum
}
