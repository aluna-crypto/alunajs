import { expect } from 'chai'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import {
  AlunaAccountEnum,
  AlunaOrderTypesEnum,
  AlunaSideEnum,
  IAlunaExchange,
  IAlunaKeySecretSchema,
  IAlunaOrderPlaceParams,
  IAlunaOrderSchema,
} from '../../..'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexOrderTypesEnum } from '../enums/BitfinexOrderTypesEnum'
import { IBitfinexOrderSchema } from '../schemas/IBitfinexOrderSchema'
import {
  BITFINEX_PARSED_ORDERS,
  BITFINEX_RAW_ORDERS,
} from '../test/fixtures/bitfinexOrders'
import { BitfinexOrderWriteModule } from './BitfinexOrderWriteModule'



describe('BitfinexOrderWriteModule', () => {

  const bitfinexOrderWriteModule = BitfinexOrderWriteModule.prototype

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const mockKeySecret = () => {

    const exchangeMock = ImportMock.mockOther(
      bitfinexOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )



    return { exchangeMock }

  }


  const getBitfinexOrderResponse = (params: {
    isPlace: boolean,
    status: string,
    text: string,
    rawOrder: IBitfinexOrderSchema | undefined,
  }) => {

    const {
      isPlace,
      status,
      text,
      rawOrder,
    } = params

    const returnedOrder = isPlace
      ? [rawOrder]
      : rawOrder

    const placeOrderMockResponse = [
      Date.now(),
      'dummy-type',
      '666',
      null,
      returnedOrder,
      666,
      status,
      text,
    ]

    return placeOrderMockResponse

  }


  it('should place Bitfinex exchange limit long order just fine', async () => {

    const symbol = 'tBTCETH'
    const amount = (Math.random() * 100) + 1
    const rate = (Math.random() * 10) + 1


    const expectedRequestBody = {
      type: BitfinexOrderTypesEnum.EXCHANGE_LIMIT,
      symbol,
      amount: amount.toString(),
      price: rate.toString(),
    }

    // long exchange limit order
    const place = await testOrderPlacement({
      account: AlunaAccountEnum.EXCHANGE,
      type: AlunaOrderTypesEnum.LIMIT,
      amount,
      symbol,
      side: AlunaSideEnum.LONG,
      rate,
    })

    expect(place.requestMock.callCount).to.be.eq(1)
    expect(place.requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
      body: expectedRequestBody,
      keySecret,
    })).to.be.ok

    expect(place.parseMock.callCount).to.be.eq(1)
    expect(place.parseMock.calledWith({
      rawOrder: place.rawOrder,
    })).to.be.ok

    expect(place.rawOrder).to.be.ok
    expect(place.placeResponse).to.deep.eq(place.parsedOrder)

  })

  it('should place Bitfinex exchange limit short order just fine', async () => {

    const symbol = 'tBTCETH'
    const amount = (Math.random() * 100) + 1
    const rate = (Math.random() * 10) + 1


    const expectedRequestBody = {
      type: BitfinexOrderTypesEnum.EXCHANGE_LIMIT,
      symbol,
      amount: (amount * -1).toString(),
      price: rate.toString(),
    }

    const place = await testOrderPlacement({
      account: AlunaAccountEnum.EXCHANGE,
      type: AlunaOrderTypesEnum.LIMIT,
      amount,
      symbol,
      side: AlunaSideEnum.SHORT,
      rate,
    })

    expect(place.requestMock.callCount).to.be.eq(1)
    expect(place.requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
      body: expectedRequestBody,
      keySecret,
    })).to.be.ok

    expect(place.parseMock.callCount).to.be.eq(1)
    expect(place.parseMock.calledWith({
      rawOrder: place.rawOrder,
    })).to.be.ok

    expect(place.rawOrder).to.be.ok
    expect(place.placeResponse).to.deep.eq(place.parsedOrder)

  })

  it('should place Bitfinex exchange market long order just fine', async () => {

    const symbol = 'tBTCETH'
    const amount = (Math.random() * 100) + 1

    const expectedRequestBody = {
      type: BitfinexOrderTypesEnum.EXCHANGE_MARKET,
      symbol,
      amount: amount.toString(),
    }

    const place = await testOrderPlacement({
      account: AlunaAccountEnum.EXCHANGE,
      type: AlunaOrderTypesEnum.MARKET,
      amount,
      symbol,
      side: AlunaSideEnum.LONG,
    })

    expect(place.requestMock.callCount).to.be.eq(1)
    expect(place.requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
      body: expectedRequestBody,
      keySecret,
    })).to.be.ok

    expect(place.parseMock.callCount).to.be.eq(1)
    expect(place.parseMock.calledWith({
      rawOrder: place.rawOrder,
    })).to.be.ok

    expect(place.rawOrder).to.be.ok
    expect(place.placeResponse).to.deep.eq(place.parsedOrder)

  })

  it('should place Bitfinex exchange market short order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.EXCHANGE_MARKET,
        symbol,
        amount: (amount * -1).toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.MARKET,
        amount,
        symbol,
        side: AlunaSideEnum.SHORT,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    })

  it(
    'should place Bitfinex exchange stop-market long order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.EXCHANGE_STOP,
        symbol,
        amount: amount.toString(),
        price: stopRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.STOP_MARKET,
        amount,
        symbol,
        side: AlunaSideEnum.LONG,
        stopRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it(
    'should place Bitfinex exchange stop-market short order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.EXCHANGE_STOP,
        symbol,
        amount: (amount * -1).toString(),
        price: stopRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.STOP_MARKET,
        amount,
        symbol,
        side: AlunaSideEnum.SHORT,
        stopRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it(
    'should place Bitfinex exchange stop-limit long order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1
      const limitRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.EXCHANGE_STOP_LIMIT,
        symbol,
        amount: amount.toString(),
        price: stopRate.toString(),
        price_aux_limit: limitRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.STOP_LIMIT,
        amount,
        symbol,
        side: AlunaSideEnum.LONG,
        stopRate,
        limitRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it(
    'should place Bitfinex exchange stop-limit short order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1
      const limitRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.EXCHANGE_STOP_LIMIT,
        symbol,
        amount: (amount * -1).toString(),
        price: stopRate.toString(),
        price_aux_limit: limitRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.STOP_LIMIT,
        amount,
        symbol,
        side: AlunaSideEnum.SHORT,
        stopRate,
        limitRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it('should place Bitfinex margin limit long order just fine', async () => {

    const symbol = 'tBTCETH'
    const amount = (Math.random() * 100) + 1
    const rate = (Math.random() * 10) + 1


    const expectedRequestBody = {
      type: BitfinexOrderTypesEnum.LIMIT,
      symbol,
      amount: amount.toString(),
      price: rate.toString(),
    }

    const place = await testOrderPlacement({
      account: AlunaAccountEnum.MARGIN,
      type: AlunaOrderTypesEnum.LIMIT,
      amount,
      symbol,
      side: AlunaSideEnum.LONG,
      rate,
    })

    expect(place.requestMock.callCount).to.be.eq(1)
    expect(place.requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
      body: expectedRequestBody,
      keySecret,
    })).to.be.ok

    expect(place.parseMock.callCount).to.be.eq(1)
    expect(place.parseMock.calledWith({
      rawOrder: place.rawOrder,
    })).to.be.ok

    expect(place.rawOrder).to.be.ok
    expect(place.placeResponse).to.deep.eq(place.parsedOrder)

  })

  it('should place Bitfinex margin limit short order just fine', async () => {

    const symbol = 'tBTCETH'
    const amount = (Math.random() * 100) + 1
    const rate = (Math.random() * 10) + 1


    const expectedRequestBody = {
      type: BitfinexOrderTypesEnum.LIMIT,
      symbol,
      amount: (amount * -1).toString(),
      price: rate.toString(),
    }

    const place = await testOrderPlacement({
      account: AlunaAccountEnum.MARGIN,
      type: AlunaOrderTypesEnum.LIMIT,
      amount,
      symbol,
      side: AlunaSideEnum.SHORT,
      rate,
    })

    expect(place.requestMock.callCount).to.be.eq(1)
    expect(place.requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
      body: expectedRequestBody,
      keySecret,
    })).to.be.ok

    expect(place.parseMock.callCount).to.be.eq(1)
    expect(place.parseMock.calledWith({
      rawOrder: place.rawOrder,
    })).to.be.ok

    expect(place.rawOrder).to.be.ok
    expect(place.placeResponse).to.deep.eq(place.parsedOrder)

  })

  it('should place Bitfinex margin market long order just fine', async () => {

    const symbol = 'tBTCETH'
    const amount = (Math.random() * 100) + 1

    const expectedRequestBody = {
      type: BitfinexOrderTypesEnum.MARKET,
      symbol,
      amount: amount.toString(),
    }

    const place = await testOrderPlacement({
      account: AlunaAccountEnum.MARGIN,
      type: AlunaOrderTypesEnum.MARKET,
      amount,
      symbol,
      side: AlunaSideEnum.LONG,
    })

    expect(place.requestMock.callCount).to.be.eq(1)
    expect(place.requestMock.calledWith({
      url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
      body: expectedRequestBody,
      keySecret,
    })).to.be.ok

    expect(place.parseMock.callCount).to.be.eq(1)
    expect(place.parseMock.calledWith({
      rawOrder: place.rawOrder,
    })).to.be.ok

    expect(place.rawOrder).to.be.ok
    expect(place.placeResponse).to.deep.eq(place.parsedOrder)

  })

  it('should place Bitfinex margin market short order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.MARKET,
        symbol,
        amount: (amount * -1).toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.MARGIN,
        type: AlunaOrderTypesEnum.MARKET,
        amount,
        symbol,
        side: AlunaSideEnum.SHORT,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    })

  it(
    'should place Bitfinex margin stop-market long order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.STOP,
        symbol,
        amount: amount.toString(),
        price: stopRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.MARGIN,
        type: AlunaOrderTypesEnum.STOP_MARKET,
        amount,
        symbol,
        side: AlunaSideEnum.LONG,
        stopRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it(
    'should place Bitfinex margin stop-market short order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.STOP,
        symbol,
        amount: (amount * -1).toString(),
        price: stopRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.MARGIN,
        type: AlunaOrderTypesEnum.STOP_MARKET,
        amount,
        symbol,
        side: AlunaSideEnum.SHORT,
        stopRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it(
    'should place Bitfinex margin stop-limit long order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1
      const limitRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.STOP_LIMIT,
        symbol,
        amount: amount.toString(),
        price: stopRate.toString(),
        price_aux_limit: limitRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.MARGIN,
        type: AlunaOrderTypesEnum.STOP_LIMIT,
        amount,
        symbol,
        side: AlunaSideEnum.LONG,
        stopRate,
        limitRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )

  it(
    'should place Bitfinex margin stop-limit short order just fine',
    async () => {

      const symbol = 'tBTCETH'
      const amount = (Math.random() * 100) + 1
      const stopRate = (Math.random() * 10) + 1
      const limitRate = (Math.random() * 10) + 1

      const expectedRequestBody = {
        type: BitfinexOrderTypesEnum.STOP_LIMIT,
        symbol,
        amount: (amount * -1).toString(),
        price: stopRate.toString(),
        price_aux_limit: limitRate.toString(),
      }

      const place = await testOrderPlacement({
        account: AlunaAccountEnum.MARGIN,
        type: AlunaOrderTypesEnum.STOP_LIMIT,
        amount,
        symbol,
        side: AlunaSideEnum.SHORT,
        stopRate,
        limitRate,
      })

      expect(place.requestMock.callCount).to.be.eq(1)
      expect(place.requestMock.calledWith({
        url: 'https://api.bitfinex.com/v2/auth/w/order/submit',
        body: expectedRequestBody,
        keySecret,
      })).to.be.ok

      expect(place.parseMock.callCount).to.be.eq(1)
      expect(place.parseMock.calledWith({
        rawOrder: place.rawOrder,
      })).to.be.ok

      expect(place.rawOrder).to.be.ok
      expect(place.placeResponse).to.deep.eq(place.parsedOrder)

    },
  )



  const testOrderPlacement = async (params: {
    account: AlunaAccountEnum,
    type: AlunaOrderTypesEnum,
    side: AlunaSideEnum,
    amount: number,
    rate?: number,
    symbol: string,
    stopRate?: number,
    limitRate?: number,
  }): Promise<{
    parseMock: Sinon.SinonStub,
    requestMock: Sinon.SinonStub,
    placeResponse: IAlunaOrderSchema,
    rawOrder?: IBitfinexOrderSchema,
    parsedOrder: IAlunaOrderSchema,
  }> => {

    const {
      type,
      account,
      amount,
      side,
      limitRate,
      symbol,
      rate,
      stopRate,
    } = params

    mockKeySecret()

    const rawOrder = BITFINEX_RAW_ORDERS[0]
    expect(rawOrder).to.be.ok

    const parsedOrder = BITFINEX_PARSED_ORDERS[0]

    const parseMock = ImportMock.mockFunction(
      bitfinexOrderWriteModule,
      'parse',
      Promise.resolve(parsedOrder),
    )

    const apiResponse = getBitfinexOrderResponse({
      isPlace: true,
      status: 'SUCCESS',
      text: 'Order placed',
      rawOrder,
    })

    const requestMock = ImportMock.mockFunction(
      BitfinexHttp,
      'privateRequest',
      Promise.resolve(apiResponse),
    )

    const placeParams: IAlunaOrderPlaceParams = {
      account,
      amount,
      side,
      symbolPair: symbol,
      type,
    }

    switch (type) {

      case AlunaOrderTypesEnum.LIMIT:
        placeParams.rate = rate
        break

      case AlunaOrderTypesEnum.STOP_MARKET:
        placeParams.stopRate = stopRate
        break

      case AlunaOrderTypesEnum.STOP_LIMIT:
        placeParams.stopRate = stopRate
        placeParams.limitRate = limitRate
        break

      default:

    }

    // placing order
    const placeResponse = await bitfinexOrderWriteModule.place(placeParams)

    expect(placeResponse).to.deep.eq(parsedOrder)

    return {
      parseMock,
      requestMock,
      rawOrder,
      placeResponse,
      parsedOrder,
    }

  }

})
