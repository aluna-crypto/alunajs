import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { ValrOrderTypeAdapter } from '../../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../../enums/adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../enums/adapters/ValrStatusAdapter'
import { VALR_SEEDS } from '../../test/fixtures'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../IValrOrderSchema'
import { ValrOrderParser } from './ValrOrderParser'



describe('ValrOrderParser', () => {

  const { ordersSeeds } = VALR_SEEDS



  it('should parse Valr orders just fine', async () => {


    const rawOrder1: IValrOrderListSchema = ordersSeeds.rawOrders[0]
    const rawOrder2: IValrOrderGetSchema = ordersSeeds.rawGetOrder[0]


    const parsedOrder1 = ValrOrderParser.parse({
      rawOrder: rawOrder1,
    })


    const rawOriginalQuantity1 = parseFloat(rawOrder1.originalQuantity)
    const rawPrice1 = parseFloat(rawOrder1.price)
    const rawSide1 = rawOrder1.side
    const rawType1 = rawOrder1.type
    const rawStatus1 = rawOrder1.status

    expect(parsedOrder1.id).to.be.eq(rawOrder1.orderId)
    expect(parsedOrder1.symbolPair).to.be.eq(rawOrder1.currencyPair)
    expect(parsedOrder1.total).to.be.eq(rawOriginalQuantity1 * rawPrice1)
    expect(parsedOrder1.amount).to.be.eq(rawOriginalQuantity1)
    expect(parsedOrder1.isAmountInContracts).not.to.be.ok
    expect(parsedOrder1.rate).to.be.eq(rawPrice1)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder1.side)
      .to.be.eq(ValrSideAdapter.translateToAluna({ from: rawSide1 }))
    expect(parsedOrder1.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus1 }))
    expect(parsedOrder1.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType1 }))
    expect(parsedOrder1.placedAt.getTime())
      .to.be.eq(new Date(rawOrder1.createdAt).getTime())


    const parsedOrder2 = ValrOrderParser.parse({
      rawOrder: rawOrder2,
    })

    const rawOriginalQuantity2 = parseFloat(rawOrder2.originalQuantity)
    const rawPrice2 = parseFloat(rawOrder2.originalPrice)
    const rawSide2 = rawOrder2.orderSide
    const rawType2 = rawOrder2.orderType
    const rawStatus2 = rawOrder2.orderStatusType

    expect(parsedOrder2.id).to.be.eq(rawOrder2.orderId)
    expect(parsedOrder2.symbolPair).to.be.eq(rawOrder2.currencyPair)
    expect(parsedOrder2.total).to.be.eq(rawOriginalQuantity2 * rawPrice2)
    expect(parsedOrder2.amount).to.be.eq(rawOriginalQuantity2)
    expect(parsedOrder2.isAmountInContracts).not.to.be.ok
    expect(parsedOrder2.rate).to.be.eq(rawPrice2)
    expect(parsedOrder2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder2.side)
      .to.be.eq(ValrSideAdapter.translateToAluna({ from: rawSide2 }))
    expect(parsedOrder2.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus2 }))
    expect(parsedOrder2.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType2 }))
    expect(parsedOrder2.placedAt.getTime())
      .to.be.eq(new Date(rawOrder2.orderCreatedAt).getTime())

  })

})
