import { expect } from 'chai'
import { cloneDeep } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { translateOrderSideToAluna } from '../../../enums/adapters/ftxOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/ftxOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/ftxOrderTypeAdapter'
import { FtxOrderStatusEnum } from '../../../enums/FtxOrderStatusEnum'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Ftx raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(FTX_RAW_ORDERS[0])

    rawOrder.status = FtxOrderStatusEnum.CLOSED
    rawOrder.filledSize = rawOrder.size

    const {
      side,
      price,
      type,
      status,
      createdAt,
      id,
      market,
      size,
      filledSize,
    } = rawOrder

    const [
      baseSymbolId,
      quoteSymbolId,
    ] = market.split('/')

    const orderType = translateOrderTypeToAluna({
      type,
    })

    const orderSide = translateOrderSideToAluna({
      from: side,
    })

    const orderStatus = translateOrderStatusToAluna({
      status,
      size,
      filledSize,
    })

    // mocking
    const exchange = new FtxAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseSymbolId)
    translateSymbolId.onSecondCall().returns(quoteSymbolId)

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

    expect(order.id).to.be.eq(id.toString())
    expect(order.account).to.be.eq(AlunaAccountEnum.SPOT)
    expect(order.baseSymbolId).to.be.eq(baseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(order.side).to.be.eq(orderSide)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.type).to.be.eq(orderType)
    expect(order.rate).to.be.eq(price)
    expect(order.total).to.be.eq(size * price!)
    expect(order.placedAt.getTime()).to.be.eq(new Date(createdAt).getTime())
    expect(order.filledAt?.getTime()).to.be.eq(mockedDate.getTime())

    expect(order.meta).to.be.eq(rawOrder)

  })

  it('should parse a Ftx raw order just fine', async () => {

    // preparing data
    const rawOrder = cloneDeep(FTX_RAW_ORDERS[1])

    rawOrder.status = FtxOrderStatusEnum.CLOSED
    rawOrder.filledSize = 0

    const {
      side,
      type,
      status,
      createdAt,
      id,
      market,
      size,
      filledSize,
      avgFillPrice,
    } = rawOrder

    const [
      baseSymbolId,
      quoteSymbolId,
    ] = market.split('/')

    const orderType = translateOrderTypeToAluna({
      type,
    })

    const orderSide = translateOrderSideToAluna({
      from: side,
    })

    const orderStatus = translateOrderStatusToAluna({
      status,
      size,
      filledSize,
    })

    // mocking
    const exchange = new FtxAuthed({ credentials })

    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.onFirstCall().returns(baseSymbolId)
    translateSymbolId.onSecondCall().returns(quoteSymbolId)

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

    expect(order.id).to.be.eq(id.toString())
    expect(order.account).to.be.eq(AlunaAccountEnum.SPOT)
    expect(order.baseSymbolId).to.be.eq(baseSymbolId)
    expect(order.quoteSymbolId).to.be.eq(quoteSymbolId)
    expect(order.side).to.be.eq(orderSide)
    expect(order.status).to.be.eq(orderStatus)
    expect(order.type).to.be.eq(orderType)
    expect(order.rate).to.be.eq(avgFillPrice)
    expect(order.total).to.be.eq(size * avgFillPrice!)
    expect(order.placedAt.getTime()).to.be.eq(new Date(createdAt).getTime())
    expect(order.canceledAt?.getTime()).to.be.eq(mockedDate.getTime())

    expect(order.meta).to.be.eq(rawOrder)

  })

})
