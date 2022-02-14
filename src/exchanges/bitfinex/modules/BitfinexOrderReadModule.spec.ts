import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderGetParams } from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexOrderParser } from '../schemas/parsers/BitfinexOrderParser'
import {
  BITFINEX_PARSED_ORDERS,
  BITFINEX_RAW_ORDERS,
} from '../test/fixtures/bitfinexOrders'
import { BitfinexOrderReadModule } from './BitfinexOrderReadModule'



describe('BitfinexOrderReadModule', () => {

  const bitfinexOrderReadModule = BitfinexOrderReadModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexOrderReadModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    return { exchangeMock }

  }

  it('should properly list Bitfinex raw orders just fine', async () => {

    const { exchangeMock } = mockKeySecret()

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve(BITFINEX_RAW_ORDERS),
    )

    const rawOrders = await bitfinexOrderReadModule.listRaw()

    expect(rawOrders).to.deep.eq(BITFINEX_RAW_ORDERS)
    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWithExactly({
      url: 'https://api.bitfinex.com/v2/auth/r/orders',
      keySecret: exchangeMock.getValue().keySecret,
    })).to.be.ok

  })

  it('should properly list Bitfinex parsed orders just fine', async () => {

    mockKeySecret()

    const listRawMock = ImportMock.mockFunction(
      bitfinexOrderReadModule,
      'listRaw',
      Promise.resolve(BITFINEX_RAW_ORDERS),
    )

    const parseManyMock = ImportMock.mockFunction(
      bitfinexOrderReadModule,
      'parseMany',
      Promise.resolve(BITFINEX_PARSED_ORDERS),
    )

    const rawOrders = await bitfinexOrderReadModule.list()

    expect(rawOrders).to.deep.eq(BITFINEX_PARSED_ORDERS)

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)
    expect(parseManyMock.calledWithExactly({
      rawOrders: BITFINEX_RAW_ORDERS,
    })).to.be.ok

  })

  it('should properly get a Bitfinex raw open order just fine', async () => {

    const { exchangeMock } = mockKeySecret()

    const returnedRawOrder = BITFINEX_RAW_ORDERS[0][0]

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve([returnedRawOrder]),
    )

    const symbolPair = 'symbol'
    const id = '666'

    const rawOrder = await bitfinexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(rawOrder).to.deep.eq(returnedRawOrder)
    expect(requestMock.calledWithExactly({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [Number(id)] },
    })).to.be.ok

  })

  it('should properly get Bitfinex raw not open order just fine', async () => {

    const { exchangeMock } = mockKeySecret()

    const returnedRawOrder = BITFINEX_RAW_ORDERS[0]

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
    )

    requestMock
      .onFirstCall()
      .returns(Promise.resolve([]))
      .onSecondCall()
      .returns(Promise.resolve([returnedRawOrder]))

    const symbolPair = 'symbol'
    const id = '666'

    const rawOrder = await bitfinexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(rawOrder).to.deep.eq(returnedRawOrder)
    expect(requestMock.calledWithExactly({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}/hist`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [Number(id)] },
    })).to.be.ok

  })

  it('should throw specific error if Bitfinex order is not found', async () => {

    let error = {} as AlunaError
    let result

    mockKeySecret()

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve([]),
    )

    const symbolPair = 'symbol'
    const id = '666'

    const params: IAlunaOrderGetParams = {
      id,
      symbolPair,
    }

    try {

      result = await bitfinexOrderReadModule.getRaw(params)

    } catch (e) {

      error = e

    }

    expect(result).not.to.be.ok

    expect(error.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error.message).to.be.eq('Order was not found.')
    expect(error.metadata).to.be.eq(params)
    expect(error.httpStatusCode).to.be.eq(400)

    expect(requestMock.callCount).to.be.eq(2)

  })

  it('should properly get a parsed Bitfinex order just fine', async () => {

    const returnedRawOrder = BITFINEX_RAW_ORDERS[0]
    const returnedParsedOrder = BITFINEX_PARSED_ORDERS[0]

    const getRawMock = ImportMock.mockFunction(
      bitfinexOrderReadModule,
      'getRaw',
      Promise.resolve(returnedRawOrder),
    )

    const parserMock = ImportMock.mockFunction(
      bitfinexOrderReadModule,
      'parse',
      Promise.resolve(returnedParsedOrder),
    )

    const symbolPair = 'symbol'
    const id = '666'

    const params = {
      symbolPair,
      id,
    }

    const parsedOrder = await bitfinexOrderReadModule.get(params)

    expect(getRawMock.callCount).to.be.eq(1)
    expect(getRawMock.calledWithExactly(params)).to.be.ok

    expect(parserMock.calledWithExactly({
      rawOrder: returnedRawOrder,
    })).to.be.ok

    expect(parsedOrder).to.deep.eq(returnedParsedOrder)

  })

  it('should properly parse many Bitfinex raw orders just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      bitfinexOrderReadModule,
      'parse',
    )

    BITFINEX_PARSED_ORDERS.forEach((rawOrder, i) => {

      parseMock.onCall(i).returns(rawOrder)

    })

    const parsedOrder = await bitfinexOrderReadModule.parseMany({
      rawOrders: BITFINEX_RAW_ORDERS,
    })

    expect(parsedOrder).to.deep.eq(BITFINEX_PARSED_ORDERS)

    // skipping 'derivatives' and 'funding' symbols
    expect(parseMock.callCount).to.be.eq(BITFINEX_RAW_ORDERS.length - 2)

  })

  it('should properly a parse Bitfinex raw order just fine', async () => {

    const parseMock = ImportMock.mockFunction(
      BitfinexOrderParser,
      'parse',
    )

    BITFINEX_PARSED_ORDERS.forEach((rawOrder, i) => {

      parseMock.onCall(i).returns(rawOrder)

    })

    // removing 'derivatives' and 'funding' symbols since the parse
    const rawOrders = BITFINEX_RAW_ORDERS.filter((r) => !/f|F0/.test(r[3]))

    const promises = rawOrders.map((rawOrder) => {

      return bitfinexOrderReadModule.parse({
        rawOrder,
      })

    })

    const parsedOrders = await Promise.all(promises)

    expect(parsedOrders).to.deep.eq(BITFINEX_PARSED_ORDERS)
    expect(parseMock.callCount).deep.eq(parsedOrders.length)

  })

})
