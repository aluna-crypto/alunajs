import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { IHuobiOrderResponseSchema } from '../../../schemas/IHuobiOrderSchema'
import {
  HUOBI_RAW_CONDITIONAL_ORDERS,
  HUOBI_RAW_ORDERS,
} from '../../../test/fixtures/huobiOrders'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import { mockParseHuobiConditionalOrder } from './helpers/parseHuobiConditionalOrder.mock'
import { mockParseHuobiOrder } from './helpers/parseHuobiOrder.mock'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Huobi raw order just fine', async () => {

    // preparing data
    const huobiOrder = HUOBI_RAW_ORDERS[0]
    const rawSymbol = HUOBI_RAW_SYMBOLS[0]

    const parsedOrder = PARSED_ORDERS[0]

    const rawOrder: IHuobiOrderResponseSchema = {
      huobiOrder,
      rawSymbol,
    }

    const {
      bc: baseSymbolId,
      qc: quoteSymbolId,
    } = rawSymbol


    // mocking
    const exchange = new HuobiAuthed({ credentials, settings: {} })

    const { parseHuobiOrder } = mockParseHuobiOrder()
    parseHuobiOrder.returns({ order: parsedOrder })

    const { parseHuobiConditionalOrder } = mockParseHuobiConditionalOrder()
    parseHuobiConditionalOrder.returns({ order: parsedOrder })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseSymbolId)

    translateSymbolId
      .onSecondCall()
      .returns(quoteSymbolId)


    // executing
    const { order } = exchange.order.parse({
      rawOrder,
    })


    // validating
    expect(order).to.deep.eq(parsedOrder)

    expect(parseHuobiOrder.callCount).to.be.eq(1)
    expect(parseHuobiOrder.firstCall.args[0]).to.deep.eq({
      baseSymbolId,
      quoteSymbolId,
      exchangeId: exchange.id,
      huobiOrder,
    })

    expect(parseHuobiConditionalOrder.callCount).to.be.eq(0)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })
    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

  it('should parse a Huobi raw conditional order just fine', async () => {

    // preparing data
    const huobiConditionalOrder = HUOBI_RAW_CONDITIONAL_ORDERS[0]
    const rawSymbol = HUOBI_RAW_SYMBOLS[0]

    const parsedOrder = PARSED_ORDERS[0]

    const rawOrder: IHuobiOrderResponseSchema = {
      huobiOrder: huobiConditionalOrder,
      rawSymbol,
    }

    const {
      bc: baseSymbolId,
      qc: quoteSymbolId,
    } = rawSymbol


    // mocking
    const exchange = new HuobiAuthed({ credentials, settings: {} })

    const { parseHuobiOrder } = mockParseHuobiOrder()
    parseHuobiOrder.returns({ order: parsedOrder })

    const { parseHuobiConditionalOrder } = mockParseHuobiConditionalOrder()
    parseHuobiConditionalOrder.returns({ order: parsedOrder })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId
      .onFirstCall()
      .returns(baseSymbolId)

    translateSymbolId
      .onSecondCall()
      .returns(quoteSymbolId)


    // executing
    const { order } = exchange.order.parse({
      rawOrder,
    })


    // validating
    expect(order).to.deep.eq(parsedOrder)

    expect(parseHuobiConditionalOrder.callCount).to.be.eq(1)
    expect(parseHuobiConditionalOrder.firstCall.args[0]).to.deep.eq({
      baseSymbolId,
      quoteSymbolId,
      exchangeId: exchange.id,
      huobiConditionalOrder,
    })

    expect(parseHuobiOrder.callCount).to.be.eq(0)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })
    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteSymbolId,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

})
