import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import {
  IAlunaExchange,
  IAlunaKeySecretSchema,
} from '../../..'
import { BitfinexHttp } from '../BitfinexHttp'
import {
  BITFINEX_PARSED_ORDER,
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

  it('should list Bitfinex raw orders just fine', async () => {

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

  it('should get a raw open Bitfinex order just fine', async () => {

    const { exchangeMock } = mockKeySecret()

    const returnedRawOrder = BITFINEX_RAW_ORDERS[0][0]

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve([returnedRawOrder]),
    )

    const symbolPair = 'symbol'
    const id = 666

    const rawOrder = await bitfinexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(1)
    expect(rawOrder).to.deep.eq(returnedRawOrder)
    expect(requestMock.calledWithExactly({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [id] },
    })).to.be.ok

  })

  it('should get a raw not open Bitfinex order just fine', async () => {

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
    const id = 666

    const rawOrder = await bitfinexOrderReadModule.getRaw({
      id,
      symbolPair,
    })

    expect(requestMock.callCount).to.be.eq(2)
    expect(rawOrder).to.deep.eq(returnedRawOrder)
    expect(requestMock.calledWithExactly({
      url: `https://api.bitfinex.com/v2/auth/r/orders/${symbolPair}/hist`,
      keySecret: exchangeMock.getValue().keySecret,
      body: { id: [id] },
    })).to.be.ok

  })

  it('should get a parsed Bitfinex order just fine', async () => {

    const returnedRawOrder = BITFINEX_RAW_ORDERS[0]
    const returnedParsedOrder = BITFINEX_PARSED_ORDER[0]

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
    const id = 666

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

})
