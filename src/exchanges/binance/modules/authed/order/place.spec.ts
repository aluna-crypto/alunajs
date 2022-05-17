import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { translateOrderSideToBinance } from '../../../enums/adapters/binanceOrderSideAdapter'
import { translateOrderTypeToBinance } from '../../../enums/adapters/binanceOrderTypeAdapter'
import { BINANCE_RAW_ORDERS } from '../../../test/fixtures/binanceOrders'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as listRawMod from '../../public/symbol/listRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Binance limit order just fine', async () => {

    // preparing data
    const mockedRawOrder = BINANCE_RAW_ORDERS[0]
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRawSymbol = BINANCE_RAW_SYMBOLS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToBinance({ from: side })
    const translatedOrderType = translateOrderTypeToBinance({ from: type })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: 'BTCETH',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: 0,
    }

    const query = new URLSearchParams()
    query.append('side', translatedOrderSide)
    query.append('symbol', params.symbolPair)
    query.append('type', translatedOrderType)
    query.append('quantity', params.amount.toString())


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrder))

    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({ rawSymbols: [mockedRawSymbol] }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })

    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new BinanceAuthed({ credentials })



    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      query,
      credentials,
      url: getBinanceEndpoints(exchange.settings).order.place,
      weight: 1,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should place a Binance market order just fine', async () => {

    // preparing data

    const mockedRawOrder = BINANCE_RAW_ORDERS[1]
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRawSymbol = BINANCE_RAW_SYMBOLS[1]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const translatedOrderSide = translateOrderSideToBinance({ from: side })
    const translatedOrderType = translateOrderTypeToBinance({ from: type })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: 0,
    }

    const query = new URLSearchParams()
    query.append('side', translatedOrderSide)
    query.append('symbol', params.symbolPair)
    query.append('type', translatedOrderType)
    query.append('quantity', params.amount.toString())

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRawOrder))

    const { listRaw } = mockListRaw({ module: listRawMod })
    listRaw.returns(Promise.resolve({ rawSymbols: [mockedRawSymbol] }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      query,
      url: getBinanceEndpoints(exchange.settings).order.place,
      weight: 1,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it(
    'should throw error for insufficient funds when placing new binance order',
    async () => {

      // preparing data
      // const mockedRawOrder = BINANCE_RAW_ORDERS[0]

      const side = AlunaOrderSideEnum.BUY
      const type = AlunaOrderTypesEnum.MARKET

      const expectedMessage = 'Account has insufficient balance '
        .concat('for requested action.')
      const expectedCode = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

      const alunaError = new AlunaError({
        message: 'dummy-error',
        code: AlunaOrderErrorCodes.PLACE_FAILED,
        httpStatusCode: 401,
        metadata: {
          code: -2010,
        },
      })

      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BinanceHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      mockValidateParams()

      mockEnsureOrderIsSupported()


      // executing
      const exchange = new BinanceAuthed({ credentials })

      const { error } = await executeAndCatch(() => exchange.order.place({
        symbolPair: '',
        account: AlunaAccountEnum.SPOT,
        amount: 0.01,
        side,
        type,
        rate: 0,
      }))


      // validating

      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(expectedCode)
      expect(error?.message).to.be.eq(expectedMessage)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

    },
  )

  it('should throw an error placing new binance order', async () => {

    // preparing data
    // const mockedRawOrder = BINANCE_RAW_ORDERS[0]

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.MARKET

    const expectedMessage = 'dummy-error'
    const expectedCode = AlunaOrderErrorCodes.PLACE_FAILED

    const alunaError = new AlunaError({
      message: 'dummy-error',
      code: AlunaOrderErrorCodes.PLACE_FAILED,
      httpStatusCode: 401,
      metadata: {},
    })

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))

    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new BinanceAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 0.01,
      side,
      type,
      rate: Number(0),
    }))

    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(expectedCode)
    expect(error?.message).to.be.eq(expectedMessage)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
