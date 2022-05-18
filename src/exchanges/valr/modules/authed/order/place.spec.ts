import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
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
import { translateOrderSideToValr } from '../../../enums/adapters/valrOrderSideAdapter'
import { translateOrderTypeToValr } from '../../../enums/adapters/valrOrderTypeAdapter'
import { ValrOrderTimeInForceEnum } from '../../../enums/ValrOderTimeInForceEnum'
import { ValrOrderStatusEnum } from '../../../enums/ValrOrderStatusEnum'
import { ValrOrderTypeEnum } from '../../../enums/ValrOrderTypeEnum'
import { VALR_RAW_CURRENCY_PAIRS } from '../../../test/fixtures/valrMarket'
import { VALR_RAW_GET_RESPONSE_ORDERS } from '../../../test/fixtures/valrOrders'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import { getValrEndpoints } from '../../../valrSpecs'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should place a Valr limit order just fine', async () => {

    // preparing data
    const valrOrder = VALR_RAW_GET_RESPONSE_ORDERS[0]
    const rawPair = VALR_RAW_CURRENCY_PAIRS[0]

    const mockedParsedOrder = cloneDeep(PARSED_ORDERS[0])


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })
    authedRequest.returns(Promise.resolve({ id: valrOrder.orderId }))

    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns({ rawOrder: { valrOrder, rawPair } })

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new ValrAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: Number(valrOrder.originalQuantity),
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }

    const { order } = await exchange.order.place(params)


    // validating
    const {
      originalQuantity: quantity,
    } = valrOrder

    const side = AlunaOrderSideEnum.BUY
    const type = AlunaOrderTypesEnum.LIMIT

    const translatedOrderSide = translateOrderSideToValr({ from: side })
    const translatedOrderType = translateOrderTypeToValr({ from: type })

    const body = {
      side: translatedOrderSide,
      pair: '',
      quantity: Number(quantity),
      price: 0,
      postOnly: false,
      timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    }

    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getValrEndpoints(exchange.settings).order.place(translatedOrderType),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should place a Valr limit order just fine', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS)[0]
    const rawPair = VALR_RAW_CURRENCY_PAIRS[0]
    valrOrder.orderType = ValrOrderTypeEnum.MARKET

    const mockedParsedOrder = cloneDeep(PARSED_ORDERS[0])


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })
    authedRequest.returns(Promise.resolve({ id: valrOrder.orderId }))

    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns({ rawOrder: { valrOrder, rawPair } })

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


    // executing
    const exchange = new ValrAuthed({ credentials })

    const params: IAlunaOrderPlaceParams = {
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: Number(valrOrder.originalQuantity),
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.MARKET,
    }

    const { order } = await exchange.order.place(params)


    // validating
    const {
      originalQuantity: quantity,
    } = valrOrder

    const translatedOrderSide = translateOrderSideToValr({ from: params.side })
    const translatedOrderType = translateOrderTypeToValr({ from: params.type })

    const body = {
      side: translatedOrderSide,
      pair: '',
      baseAmount: Number(quantity),
    }

    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      body,
      credentials,
      url: getValrEndpoints(exchange.settings).order.place(translatedOrderType),
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

  })

  it('should throw error when placing new valr order', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS)[0]
    valrOrder.orderType = ValrOrderTypeEnum.MARKET

    const mockedParsedOrder = cloneDeep(PARSED_ORDERS)[0]

    const rawOrder = {
      valrOrder: {
        orderStatusType: ValrOrderStatusEnum.FAILED,
        failedReason: 'dummy-error',
      },
    }


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })
    authedRequest.returns(Promise.resolve({ id: valrOrder.orderId }))

    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns({ rawOrder })

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }))

    // validating

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error?.message).to.be.eq('dummy-error')

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error when placing new valr order', async () => {

    // preparing data
    const valrOrder = cloneDeep(VALR_RAW_GET_RESPONSE_ORDERS)[0]
    valrOrder.orderType = ValrOrderTypeEnum.MARKET

    const mockedParsedOrder = cloneDeep(PARSED_ORDERS)[0]

    const rawOrder = {
      valrOrder: {
        orderStatusType: ValrOrderStatusEnum.FAILED,
        failedReason: 'Insufficient Balance',
      },
    }


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })
    authedRequest.returns(Promise.resolve({ id: valrOrder.orderId }))

    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns({ rawOrder })

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    mockValidateParams()

    mockEnsureOrderIsSupported()


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.place({
      symbolPair: '',
      account: AlunaAccountEnum.SPOT,
      amount: 10,
      side: AlunaOrderSideEnum.BUY,
      type: AlunaOrderTypesEnum.LIMIT,
      rate: 0,
    }))

    // validating

    expect(error instanceof AlunaError).to.be.ok
    expect(error?.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error?.message).to.be.eq('Insufficient Balance')

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
