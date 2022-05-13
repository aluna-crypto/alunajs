import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translateOrderSideToAluna } from '../../../enums/adapters/poloniexOrderSideAdapter'
import {
  translateOrderStatusToAluna,
  translatePoloniexOrderStatus,
} from '../../../enums/adapters/poloniexOrderStatusAdapter'
import { PoloniexOrderSideEnum } from '../../../enums/PoloniexOrderSideEnum'
import { PoloniexOrderStatusEnum } from '../../../enums/PoloniexOrderStatusEnum'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import {
  POLONIEX_RAW_ORDER_STATUS_INFO,
  POLONIEX_RAW_ORDERS,
} from '../../../test/fixtures/poloniexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Poloniex raw order just fine', async () => {

    // preparing data
    const rawOrder = POLONIEX_RAW_ORDERS[0]

    const exchange = new PoloniexAuthed({ credentials })

    const {
      amount,
      currencyPair,
      date,
      orderNumber,
      rate,
      total,
      type,
      startingAmount,
    } = rawOrder

    const [quoteCurrency, baseCurrency] = currencyPair.split('_')

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)

    translateSymbolId.onSecondCall().returns(quoteCurrency)

    const translatedPoloniexStatus = translatePoloniexOrderStatus({
      amount,
      startingAmount,
    })

    const orderStatus = translateOrderStatusToAluna({
      from: translatedPoloniexStatus,
    })

    // @TODO -> need to verify type property
    const orderSide = translateOrderSideToAluna({
      from: type as unknown as PoloniexOrderSideEnum,
    })

    const orderAmount = Number(startingAmount)

    const { order } = exchange.order.parse({ rawOrder })

    // validating
    expect(order).to.exist

    expect(order.status).to.be.eq(orderStatus)
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.side).to.be.eq(orderSide)
    expect(order.total).to.be.eq(Number(total))
    expect(order.id).to.be.eq(orderNumber)
    expect(order.placedAt.getTime()).to.be.eq(new Date(date).getTime())
    expect(order.rate).to.be.eq(Number(rate))
    expect(order.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(order.account).to.be.eq(AlunaAccountEnum.SPOT)

    expect(order.meta).to.be.eq(rawOrder)

  })

  it('should parse a Poloniex raw order status just fine', async () => {

    // preparing data
    const rawOrder = POLONIEX_RAW_ORDER_STATUS_INFO[0]

    const exchange = new PoloniexAuthed({ credentials })

    const {
      amount,
      currencyPair,
      orderNumber,
      rate,
      total,
      type,
      startingAmount,
      status,
    } = rawOrder

    const [quoteCurrency, baseCurrency] = currencyPair.split('_')

    const translatedPoloniexStatus = translatePoloniexOrderStatus({
      amount,
      startingAmount,
      status,
    })

    const orderStatus = translateOrderStatusToAluna({
      from: translatedPoloniexStatus,
    })

    // @TODO -> need to verify type property
    const orderSide = translateOrderSideToAluna({
      from: type as unknown as PoloniexOrderSideEnum,
    })

    const orderAmount = Number(startingAmount)

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)

    translateSymbolId.onSecondCall().returns(quoteCurrency)

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )

    // executing

    const { order } = exchange.order.parse({ rawOrder })

    // validating
    expect(order).to.exist

    expect(order.status).to.be.eq(orderStatus)
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.side).to.be.eq(orderSide)
    expect(order.total).to.be.eq(Number(total))
    expect(order.id).to.be.eq(orderNumber)
    expect(order.rate).to.be.eq(Number(rate))
    expect(order.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(order.account).to.be.eq(AlunaAccountEnum.SPOT)
    expect(order.filledAt).to.be.eq(mockedDate)

    expect(order.meta).to.be.eq(rawOrder)

  })

  it('should parse a Poloniex raw canceled order status just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(POLONIEX_RAW_ORDER_STATUS_INFO[0])

    // mocking raw data
    rawOrder.startingAmount = undefined as any
    rawOrder.status = PoloniexOrderStatusEnum.CANCELED

    const exchange = new PoloniexAuthed({ credentials })

    const {
      amount,
      currencyPair,
      orderNumber,
      rate,
      total,
      type,
      startingAmount,
      status,
    } = rawOrder

    const [quoteCurrency, baseCurrency] = currencyPair.split('_')

    const translatedPoloniexStatus = translatePoloniexOrderStatus({
      amount,
      startingAmount,
      status,
    })

    const orderStatus = translateOrderStatusToAluna({
      from: translatedPoloniexStatus,
    })

    // @TODO -> need to verify type property
    const orderSide = translateOrderSideToAluna({
      from: type as unknown as PoloniexOrderSideEnum,
    })

    const orderAmount = Number(amount)

    // mocking

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseCurrency)

    translateSymbolId.onSecondCall().returns(quoteCurrency)

    const mockedDate = new Date()

    ImportMock.mockFunction(
      global,
      'Date',
      mockedDate,
    )

    // executing

    const { order } = exchange.order.parse({ rawOrder })

    // validating
    expect(order).to.exist

    expect(order.status).to.be.eq(orderStatus)
    expect(order.amount).to.be.eq(orderAmount)
    expect(order.side).to.be.eq(orderSide)
    expect(order.total).to.be.eq(Number(total))
    expect(order.id).to.be.eq(orderNumber)
    expect(order.rate).to.be.eq(Number(rate))
    expect(order.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(order.account).to.be.eq(AlunaAccountEnum.SPOT)
    expect(order.canceledAt).to.be.eq(mockedDate)

    expect(order.meta).to.be.eq(rawOrder)

  })

})
