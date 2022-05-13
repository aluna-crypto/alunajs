import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGet } from '../../../../../../test/mocks/exchange/modules/mockGet'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as getMod from '../../public/market/get'
import { mockAssembleRequestBody } from './helpers/assembleRequestBody.mock'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Bitmex order just fine', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]

    const parsedOrder = PARSED_ORDERS[0]
    const market = PARSED_MARKETS[0]

    const body = {
      symbol: bitmexOrder.symbol,
      side: bitmexOrder.side,
      ordType: bitmexOrder.ordType,
      orderQty: bitmexOrder.orderQty,
      price: bitmexOrder.price,
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.resolve(bitmexOrder))

    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ market }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: parsedOrder })

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { assembleRequestBody } = mockAssembleRequestBody()
    assembleRequestBody.returns({ body })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: bitmexOrder.symbol,
      account: AlunaAccountEnum.EXCHANGE,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const { order } = await exchange.order.place(params)


    // validating
    expect(order).to.deep.eq(parsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getBitmexEndpoints(exchange.settings).order.place,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(assembleRequestBody.callCount).to.be.eq(1)
    expect(assembleRequestBody.firstCall.args[0]).to.deep.eq({
      action: 'place',
      instrument: market.instrument!,
      orderParams: params,
      settings: exchange.settings,
    })

    expect(get.callCount).to.be.eq(1)
    expect(get.firstCall.args[0]).to.deep.eq({
      symbolPair: bitmexOrder.symbol,
      http: new BitmexHttp({}),
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: {
        bitmexOrder,
        market,
      },
    })

    expect(validateParamsMock.callCount).to.be.eq(1)

  })

  it(
    'should throw error for insufficient funds when placing new bitmex order',
    async () => {

      // preparing data
      const bitmexOrder = BITMEX_RAW_ORDERS[0]
      const market = PARSED_MARKETS[0]

      const body = {
        symbol: bitmexOrder.symbol,
        side: bitmexOrder.side,
        ordType: bitmexOrder.ordType,
        orderQty: bitmexOrder.orderQty,
        price: bitmexOrder.price,
      }

      const message = 'Account has insufficient Available Balance'

      const alunaError = new AlunaError({
        message,
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        httpStatusCode: 400,
      })


      // mocking
      const {
        publicRequest,
        authedRequest,
      } = mockHttp({ classPrototype: BitmexHttp.prototype })

      authedRequest.returns(Promise.reject(alunaError))

      const { get } = mockGet({ module: getMod })
      get.returns(Promise.resolve({ market }))

      const { parse } = mockParse({ module: parseMod })

      const { validateParamsMock } = mockValidateParams()
      const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

      const { assembleRequestBody } = mockAssembleRequestBody()
      assembleRequestBody.returns({ body })


      // executing
      const exchange = new BitmexAuthed({ credentials })

      const params: IAlunaOrderPlaceParams = {
        symbolPair: bitmexOrder.symbol,
        account: AlunaAccountEnum.EXCHANGE,
        amount: 0.01,
        side: AlunaOrderSideEnum.BUY,
        type: AlunaOrderTypesEnum.LIMIT,
        rate: 0,
      }

      const {
        error,
      } = await executeAndCatch(() => exchange.order.place(params))


      // validating
      expect(error instanceof AlunaError).to.be.ok
      expect(error?.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
      expect(error?.message).to.be.eq(message)

      expect(authedRequest.callCount).to.be.eq(1)

      expect(publicRequest.callCount).to.be.eq(0)

      expect(validateParamsMock.callCount).to.be.eq(1)
      expect(ensureOrderIsSupported.callCount).to.be.eq(1)

      expect(get.callCount).to.be.eq(1)

      expect(parse.callCount).to.be.eq(0)

    },
  )

  it('should throw error if place order fails somehow', async () => {

    // preparing data
    const bitmexOrder = BITMEX_RAW_ORDERS[0]
    const market = PARSED_MARKETS[0]

    const body = {
      symbol: bitmexOrder.symbol,
      side: bitmexOrder.side,
      ordType: bitmexOrder.ordType,
      orderQty: bitmexOrder.orderQty,
      price: bitmexOrder.price,
    }

    const message = 'unknown error'

    const alunaError = new AlunaError({
      message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: 400,
    })


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.reject(alunaError))

    const { get } = mockGet({ module: getMod })
    get.returns(Promise.resolve({ market }))

    const { parse } = mockParse({ module: parseMod })

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { assembleRequestBody } = mockAssembleRequestBody()
    assembleRequestBody.returns({ body })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: bitmexOrder.symbol,
      account: AlunaAccountEnum.EXCHANGE,
      amount: 0.01,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const {
      error,
    } = await executeAndCatch(() => exchange.order.place(params))


    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error?.message).to.be.eq(message)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(get.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

  })

})
