import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { testEditOrder } from '../../../../../../test/macros/testEditOrder'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaBalanceErrorCodes } from '../../../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderEditParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { mockEnsureOrderIsSupported } from '../../../../../utils/orders/ensureOrderIsSupported.mock'
import { mockValidateParams } from '../../../../../utils/validation/validateParams.mock'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../enums/adapters/bitfinexOrderSideAdapter'
import { BITFINEX_CANCEL_ORDER_RESPONSE } from '../../../test/fixtures/bitfinexOrders'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const commonOrderParams: IAlunaOrderEditParams = {
    id: 'id',
    account: AlunaAccountEnum.SPOT,
    amount: 10,
    side: AlunaOrderSideEnum.BUY,
    symbolPair: 'tBTCETH',
    type: AlunaOrderTypesEnum.LIMIT,
    rate: 5,
    stopRate: 10,
    limitRate: 15,
  }

  testEditOrder({
    ExchangeAuthed: BitfinexAuthed,
    HttpClass: BitfinexHttp,
    parseImportPath: parseMod,
    rawOrders: [BITFINEX_CANCEL_ORDER_RESPONSE],
    credentials,
    validationCallback: (params) => {

      const {
        editParams,
        authedRequestStub: stub,
      } = params

      const {
        type,
        side,
        amount,
        rate,
        limitRate,
        stopRate,
        id,
      } = editParams

      const translatedAmount = translateOrderSideToBitfinex({
        amount: Number(amount),
        side,
      })

      let price: undefined | string
      let priceAuxLimit: undefined | string

      switch (type) {

        case AlunaOrderTypesEnum.LIMIT:
          price = rate!.toString()
          break

        case AlunaOrderTypesEnum.STOP_MARKET:
          price = stopRate!.toString()
          break

        case AlunaOrderTypesEnum.STOP_LIMIT:
          price = stopRate!.toString()
          priceAuxLimit = limitRate!.toString()
          break

        default:

      }

      const body: Record<string, any> = {
        ...(price ? { price } : {}),
        ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
        amount: translatedAmount,
        id: Number(id),
      }

      expect(stub.firstCall.args[0]).to.deep.eq({
        url: getBitfinexEndpoints({}).order.edit,
        body,
        credentials,
      })

    },
  })


  it('should throw error if order edit request fails', async () => {

    // preparing data
    const mockedRequestResponse = cloneDeep(BITFINEX_CANCEL_ORDER_RESPONSE)
    mockedRequestResponse[6] = 'ERROR'


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.edit(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaHttpErrorCodes.REQUEST_ERROR)
    expect(error!.message).to.be.eq(mockedRequestResponse[7])
    expect(error!.httpStatusCode).to.be.eq(500)
    expect(error!.metadata).to.be.eq(mockedRequestResponse)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if balance is insuficient to edit order', async () => {

    // preparing data
    const affiliateCode = 'affiliateCode'

    const message = 'not enough balance to edit order for xxx'

    const throwedError = new AlunaError({
      code: AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE,
      message,
      httpStatusCode: 500,
    })


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.reject(throwedError))

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitfinexAuthed({
      credentials,
      settings: { affiliateCode },
    })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.edit(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error!.message).to.be.eq(message)
    expect(error!.httpStatusCode).to.be.eq(200)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if order is not found', async () => {

    // preparing data
    const message = 'order: invalid'

    const throwedError = new AlunaError({
      code: AlunaOrderErrorCodes.NOT_FOUND,
      message,
      httpStatusCode: 400,
    })


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })
    authedRequest.returns(Promise.reject(throwedError))

    const { validateParamsMock } = mockValidateParams()
    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.edit(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    const msg = 'order was not found or may not be open'

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq(msg)
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(publicRequest.callCount).to.be.eq(0)

  })

})
