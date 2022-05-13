import { expect } from 'chai'
import {
  cloneDeep,
  filter,
} from 'lodash'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translateOrderSideToAluna } from '../../../enums/adapters/gateOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/gateOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/gateOrderTypeAdapter'
import { GateOrderStatusEnum } from '../../../enums/GateOrderStatusEnum'
import { GateAuthed } from '../../../GateAuthed'
import { gateBaseSpecs } from '../../../gateSpecs'
import { GATE_RAW_ORDERS } from '../../../test/fixtures/gateOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Gate raw order just fine', async () => {

    // preparing data

    const exchange = new GateAuthed({ credentials })
    const rawOrder = GATE_RAW_ORDERS[0]

    const {
      id,
      type: orderType,
      status,
      amount: quantity,
      currency_pair: currencyPair,
      side,
      price,
      create_time_ms: createdTime,
      left,
    } = rawOrder

    const amount = Number(quantity)
    const leftToFill = Number(left)
    const rate = Number(price)
    const total = amount * rate
    const createdAt = new Date(createdTime)
    const [baseCurrency, quoteCurrency] = currencyPair.split('_')

    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    const orderStatus = translateOrderStatusToAluna({
      from: status, leftToFill, amount,
    })

    const orderSide = translateOrderSideToAluna({ from: side })

    const type = translateOrderTypeToAluna({ from: orderType })


    // executing
    const { order } = exchange.order.parse({ rawOrder })

    expect(order.account).to.be.eq(AlunaAccountEnum.SPOT)
    expect(order.amount).to.be.eq(amount)
    expect(order.symbolPair).to.be.eq(currencyPair)
    expect(order.baseSymbolId).to.be.eq(baseCurrency)
    expect(order.quoteSymbolId).to.be.eq(quoteCurrency)
    expect(order.exchangeId).to.be.eq(gateBaseSpecs.id)
    expect(order.id).to.be.eq(id)
    expect(order.placedAt.getTime()).to.be.eq(createdAt.getTime())
    expect(order.side).to.be.eq(orderSide)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.type).to.be.eq(type)
    expect(order.total).to.be.eq(total)

    expect(order.meta).to.deep.eq(rawOrder)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })
    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

  it('should parse a Gate raw filled order just fine', async () => {

    // preparing data

    const exchange = new GateAuthed({ credentials })
    const rawOrder = filter(
      GATE_RAW_ORDERS, { status: GateOrderStatusEnum.CLOSED },
    )[0]

    const {
      status,
      amount: quantity,
      currency_pair: currencyPair,
      create_time_ms: createdTime,
      update_time_ms: updatedTime,
      left,
    } = rawOrder

    const amount = Number(quantity)
    const leftToFill = Number(left)
    const createdAt = new Date(createdTime)
    const updatedAt = new Date(updatedTime)
    const [baseCurrency, quoteCurrency] = currencyPair.split('_')

    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    const orderStatus = translateOrderStatusToAluna({
      from: status, leftToFill, amount,
    })


    // executing
    const { order } = exchange.order.parse({ rawOrder })

    expect(order.placedAt.getTime()).to.be.eq(createdAt.getTime())
    expect(order.filledAt?.getTime()).to.be.eq(updatedAt.getTime())
    expect(order.status).to.be.eq(orderStatus)

    expect(order.meta).to.deep.eq(rawOrder)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })
    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

  it('should parse a Gate raw canceled order just fine', async () => {

    // preparing data

    const exchange = new GateAuthed({ credentials })
    const rawOrder = cloneDeep(GATE_RAW_ORDERS[0])

    rawOrder.status = GateOrderStatusEnum.CANCELLED

    const {
      status,
      amount: quantity,
      currency_pair: currencyPair,
      create_time_ms: createdTime,
      update_time_ms: updatedTime,
      left,
    } = rawOrder

    const amount = Number(quantity)
    const leftToFill = Number(left)
    const createdAt = new Date(createdTime)
    const updatedAt = new Date(updatedTime)
    const [baseCurrency, quoteCurrency] = currencyPair.split('_')

    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    const orderStatus = translateOrderStatusToAluna({
      from: status, leftToFill, amount,
    })


    // executing
    const { order } = exchange.order.parse({ rawOrder })

    expect(order.placedAt.getTime()).to.be.eq(createdAt.getTime())
    expect(order.canceledAt?.getTime()).to.be.eq(updatedAt.getTime())
    expect(order.status).to.be.eq(orderStatus)

    expect(order.meta).to.deep.eq(rawOrder)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })
    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: exchange.settings.symbolMappings,
    })

  })

})
