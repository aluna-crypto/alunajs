import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { ValrOrderSideAdapter } from '../../enums/adapters/ValrOrderSideAdapter'
import { ValrOrderTypeAdapter } from '../../enums/adapters/ValrOrderTypeAdapter'
import { ValrStatusAdapter } from '../../enums/adapters/ValrStatusAdapter'
import { VALR_RAW_CURRENCY_PAIRS } from '../../test/fixtures/valrMarket'
import {
  VALR_RAW_GET_ORDERS,
  VALR_RAW_LIST_OPEN_ORDERS,
} from '../../test/fixtures/valrOrder'
import { ValrOrderParser } from './ValrOrderParser'



describe('ValrOrderParser', () => {

  it('should parse Valr orders just fine', () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawOrder1 = VALR_RAW_LIST_OPEN_ORDERS[0]
    const rawOrder2 = VALR_RAW_GET_ORDERS[0]
    const rawOrder3 = VALR_RAW_LIST_OPEN_ORDERS[4]

    const rawCurrencyPair1 = VALR_RAW_CURRENCY_PAIRS[1]
    const rawCurrencyPair2 = VALR_RAW_CURRENCY_PAIRS[3]

    const parsedOrder1 = ValrOrderParser.parse({
      rawOrder: rawOrder1,
      currencyPair: rawCurrencyPair1,
    })

    const rawOriginalQuantity1 = parseFloat(rawOrder1.originalQuantity)
    const rawPrice1 = parseFloat(rawOrder1.price)
    const rawSide1 = rawOrder1.side
    const rawType1 = rawOrder1.type
    const rawStatus1 = rawOrder1.status
    const rawStopPrice1 = rawOrder1.stopPrice

    expect(parsedOrder1.id).to.be.eq(rawOrder1.orderId)
    expect(parsedOrder1.symbolPair).to.be.eq(rawOrder1.currencyPair)
    expect(parsedOrder1.baseSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder1.quoteSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder1.total).to.be.eq(rawOriginalQuantity1 * rawPrice1)
    expect(parsedOrder1.amount).to.be.eq(rawOriginalQuantity1)
    expect(parsedOrder1.rate).not.to.be.ok
    expect(parsedOrder1.limitRate).to.be.eq(rawPrice1)
    expect(parsedOrder1.stopRate).to.be.eq(Number(rawStopPrice1))
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder1.side)
      .to.be.eq(ValrOrderSideAdapter.translateToAluna({ from: rawSide1 }))
    expect(parsedOrder1.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus1 }))
    expect(parsedOrder1.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType1 }))
    expect(parsedOrder1.placedAt.getTime())
      .to.be.eq(new Date(rawOrder1.createdAt).getTime())
    expect(parsedOrder1.filledAt).to.be.ok
    expect(parsedOrder1.filledAt?.getTime())
      .to.be.eq(new Date(rawOrder1.updatedAt).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: rawCurrencyPair1.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: rawCurrencyPair1.quoteCurrency,
      symbolMappings: {},
    })

    const parsedOrder2 = ValrOrderParser.parse({
      rawOrder: rawOrder2,
      currencyPair: rawCurrencyPair1,
    })

    const rawOriginalQuantity2 = parseFloat(rawOrder2.originalQuantity)
    const rawPrice2 = parseFloat(rawOrder2.originalPrice)
    const rawSide2 = rawOrder2.orderSide
    const rawType2 = rawOrder2.orderType
    const rawStatus2 = rawOrder2.orderStatusType
    const rawStopPrice2 = rawOrder2.stopPrice

    expect(parsedOrder2.id).to.be.eq(rawOrder2.orderId)
    expect(parsedOrder2.symbolPair).to.be.eq(rawOrder2.currencyPair)
    expect(parsedOrder2.baseSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder2.quoteSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder2.total).to.be.eq(rawOriginalQuantity2 * rawPrice2)
    expect(parsedOrder2.amount).to.be.eq(rawOriginalQuantity2)
    expect(parsedOrder2.rate).not.to.be.ok
    expect(parsedOrder2.limitRate).to.be.eq(rawPrice2)
    expect(parsedOrder2.stopRate).to.be.eq(Number(rawStopPrice2))
    expect(parsedOrder2.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder2.side)
      .to.be.eq(ValrOrderSideAdapter.translateToAluna({ from: rawSide2 }))
    expect(parsedOrder2.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus2 }))
    expect(parsedOrder2.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType2 }))
    expect(parsedOrder2.placedAt.getTime())
      .to.be.eq(new Date(rawOrder2.orderCreatedAt).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(4)
    expect(alunaSymbolMappingMock.args[2][0]).to.deep.eq({
      exchangeSymbolId: rawCurrencyPair1.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[3][0]).to.deep.eq({
      exchangeSymbolId: rawCurrencyPair1.quoteCurrency,
      symbolMappings: {},
    })


    const parsedOrder3 = ValrOrderParser.parse({
      rawOrder: rawOrder3,
      currencyPair: rawCurrencyPair2,
    })

    const rawOriginalQuantity3 = parseFloat(rawOrder3.originalQuantity)
    const rawPrice3 = parseFloat(rawOrder3.price)
    const rawSide3 = rawOrder3.side
    const rawType3 = rawOrder3.type
    const rawStatus3 = rawOrder3.status

    expect(parsedOrder3.id).to.be.eq(rawOrder3.orderId)
    expect(parsedOrder3.symbolPair).to.be.eq(rawOrder3.currencyPair)
    expect(parsedOrder3.baseSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder3.quoteSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder3.total).to.be.eq(rawOriginalQuantity3 * rawPrice3)
    expect(parsedOrder3.amount).to.be.eq(rawOriginalQuantity3)
    expect(parsedOrder3.rate).to.be.eq(rawPrice3)
    expect(parsedOrder3.limitRate).not.to.be.ok
    expect(parsedOrder3.stopRate).not.to.be.ok
    expect(parsedOrder3.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder3.side)
      .to.be.eq(ValrOrderSideAdapter.translateToAluna({ from: rawSide3 }))
    expect(parsedOrder3.status)
      .to.be.eq(ValrStatusAdapter.translateToAluna({ from: rawStatus3 }))
    expect(parsedOrder3.type)
      .to.be.eq(ValrOrderTypeAdapter.translateToAluna({ from: rawType3 }))
    expect(parsedOrder3.placedAt.getTime())
      .to.be.eq(new Date(rawOrder3.createdAt).getTime())
    expect(parsedOrder3.canceledAt).to.be.ok
    expect(parsedOrder3.canceledAt?.getTime())
      .to.be.eq(new Date(rawOrder3.updatedAt).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(6)
    expect(alunaSymbolMappingMock.args[4][0]).to.deep.eq({
      exchangeSymbolId: rawCurrencyPair2.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[5][0]).to.deep.eq({
      exchangeSymbolId: rawCurrencyPair2.quoteCurrency,
      symbolMappings: {},
    })

  })

})
