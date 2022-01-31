import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { ValrOrderTypeAdapter } from '../../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../../enums/adapters/ValrSideAdapter'
import { ValrStatusAdapter } from '../../enums/adapters/ValrStatusAdapter'
import { VALR_RAW_CURRENCY_PAIRS } from '../../test/fixtures/valrMarket'
import {
  VALR_RAW_GET_ORDERS,
  VALR_RAW_LIST_OPEN_ORDERS,
} from '../../test/fixtures/valrOrder'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../IValrOrderSchema'
import { ValrOrderParser } from './ValrOrderParser'



describe('ValrOrderParser', () => {

  it('should parse Valr orders just fine', () => {

    const rawOrder1: IValrOrderListSchema = VALR_RAW_LIST_OPEN_ORDERS[0]
    const rawOrder2: IValrOrderGetSchema = VALR_RAW_GET_ORDERS[0]
    const rawOrder3: IValrOrderListSchema = VALR_RAW_LIST_OPEN_ORDERS[4]

    const parsedOrder1 = ValrOrderParser.parse({
      rawOrder: rawOrder1,
      currencyPair: VALR_RAW_CURRENCY_PAIRS[1],
    })

    const rawOriginalQuantity1 = parseFloat(rawOrder1.originalQuantity)
    const rawPrice1 = parseFloat(rawOrder1.price)
    const rawSide1 = rawOrder1.side
    const rawType1 = rawOrder1.type
    const rawStatus1 = rawOrder1.status
    const rawStopPrice1 = rawOrder1.stopPrice

    let expectedBaseSymbolId = rawOrder1.currencyPair.slice(0, 3)
    let expectedQuoteSymbolId = rawOrder1.currencyPair.slice(3)

    expect(parsedOrder1.id).to.be.eq(rawOrder1.orderId)
    expect(parsedOrder1.symbolPair).to.be.eq(rawOrder1.currencyPair)
    expect(parsedOrder1.baseSymbolId).to.be.eq(expectedBaseSymbolId)
    expect(parsedOrder1.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
    expect(parsedOrder1.total).to.be.eq(rawOriginalQuantity1 * rawPrice1)
    expect(parsedOrder1.amount).to.be.eq(rawOriginalQuantity1)
    expect(parsedOrder1.rate).not.to.be.ok
    expect(parsedOrder1.limitRate).to.be.eq(rawPrice1)
    expect(parsedOrder1.stopRate).to.be.eq(Number(rawStopPrice1))
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder1.side)
      .to.be.eq(ValrSideAdapter.translateToAluna({ from: rawSide1 }))
    expect(parsedOrder1.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus1 }))
    expect(parsedOrder1.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType1 }))
    expect(parsedOrder1.placedAt.getTime())
      .to.be.eq(new Date(rawOrder1.createdAt).getTime())
    expect(parsedOrder1.filledAt).to.be.ok
    expect(parsedOrder1.filledAt?.getTime())
      .to.be.eq(new Date(rawOrder1.updatedAt).getTime())

    const parsedOrder2 = ValrOrderParser.parse({
      rawOrder: rawOrder2,
      currencyPair: VALR_RAW_CURRENCY_PAIRS[1],
    })

    const rawOriginalQuantity2 = parseFloat(rawOrder2.originalQuantity)
    const rawPrice2 = parseFloat(rawOrder2.originalPrice)
    const rawSide2 = rawOrder2.orderSide
    const rawType2 = rawOrder2.orderType
    const rawStatus2 = rawOrder2.orderStatusType
    const rawStopPrice2 = rawOrder2.stopPrice

    expectedBaseSymbolId = rawOrder2.currencyPair.slice(0, 3)
    expectedQuoteSymbolId = rawOrder2.currencyPair.slice(3)

    expect(parsedOrder2.id).to.be.eq(rawOrder2.orderId)
    expect(parsedOrder2.symbolPair).to.be.eq(rawOrder2.currencyPair)
    expect(parsedOrder2.baseSymbolId).to.be.eq(expectedBaseSymbolId)
    expect(parsedOrder2.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
    expect(parsedOrder2.total).to.be.eq(rawOriginalQuantity2 * rawPrice2)
    expect(parsedOrder2.amount).to.be.eq(rawOriginalQuantity2)
    expect(parsedOrder2.rate).not.to.be.ok
    expect(parsedOrder2.limitRate).to.be.eq(rawPrice2)
    expect(parsedOrder2.stopRate).to.be.eq(Number(rawStopPrice2))
    expect(parsedOrder2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder2.side)
      .to.be.eq(ValrSideAdapter.translateToAluna({ from: rawSide2 }))
    expect(parsedOrder2.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus2 }))
    expect(parsedOrder2.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType2 }))
    expect(parsedOrder2.placedAt.getTime())
      .to.be.eq(new Date(rawOrder2.orderCreatedAt).getTime())

    const parsedOrder3 = ValrOrderParser.parse({
      rawOrder: rawOrder3,
      currencyPair: VALR_RAW_CURRENCY_PAIRS[3],
    })

    const rawOriginalQuantity3 = parseFloat(rawOrder3.originalQuantity)
    const rawPrice3 = parseFloat(rawOrder3.price)
    const rawSide3 = rawOrder3.side
    const rawType3 = rawOrder3.type
    const rawStatus3 = rawOrder3.status

    expectedBaseSymbolId = 'USDC'
    expectedQuoteSymbolId = 'ZAR'

    expect(parsedOrder3.id).to.be.eq(rawOrder3.orderId)
    expect(parsedOrder3.symbolPair).to.be.eq(rawOrder3.currencyPair)
    expect(parsedOrder3.baseSymbolId).to.be.eq(expectedBaseSymbolId)
    expect(parsedOrder3.quoteSymbolId).to.be.eq(expectedQuoteSymbolId)
    expect(parsedOrder3.total).to.be.eq(rawOriginalQuantity3 * rawPrice3)
    expect(parsedOrder3.amount).to.be.eq(rawOriginalQuantity3)
    expect(parsedOrder3.rate).to.be.eq(rawPrice3)
    expect(parsedOrder3.limitRate).not.to.be.ok
    expect(parsedOrder3.stopRate).not.to.be.ok
    expect(parsedOrder3.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder3.side)
      .to.be.eq(ValrSideAdapter.translateToAluna({ from: rawSide3 }))
    expect(parsedOrder3.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus3 }))
    expect(parsedOrder3.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType3 }))
    expect(parsedOrder3.placedAt.getTime())
      .to.be.eq(new Date(rawOrder3.createdAt).getTime())
    expect(parsedOrder3.canceledAt).to.be.ok
    expect(parsedOrder3.canceledAt?.getTime())
      .to.be.eq(new Date(rawOrder3.updatedAt).getTime())

  })

})
