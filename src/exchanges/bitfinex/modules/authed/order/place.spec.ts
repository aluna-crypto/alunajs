import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
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
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import { BITFINEX_PLACE_ORDER_RESPONSE } from '../../../test/fixtures/bitfinexOrders'
import * as parseMod from './parse'
import { testBitfinexOrderPlace } from './test/testBitfinexOrderPlace'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const commonOrderParams: IAlunaOrderPlaceParams = {
    account: AlunaAccountEnum.SPOT,
    amount: 10,
    side: AlunaOrderSideEnum.BUY,
    symbolPair: 'tBTCETH',
    type: AlunaOrderTypesEnum.LIMIT,
    rate: 5,
    stopRate: 10,
    limitRate: 15,
  }

  const bitfinexAccounts = bitfinexBaseSpecs.accounts

  each(bitfinexAccounts, (account) => {

    const {
      implemented,
      orderTypes,
      type: accountType,
    } = account

    if (implemented) {

      each(orderTypes, (orderType) => {

        const {
          type,
          implemented: isTypeImplemented,
        } = orderType

        if (isTypeImplemented) {

          // Buy Order
          const orderParams: IAlunaOrderPlaceParams = {
            ...commonOrderParams,
            account: accountType,
            type,
            amount: 10,
          }

          testBitfinexOrderPlace(orderParams)


          // Sell Order
          testBitfinexOrderPlace({
            ...orderParams,
            amount: -10,
          })

        }

      })

    }

  })

  it('should throw error if order place request fails', async () => {

    // preparing data
    const mockedRequestResponse = cloneDeep(BITFINEX_PLACE_ORDER_RESPONSE)
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
    } = await executeAndCatch(() => exchange.order.place(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.PLACE_FAILED)
    expect(error!.message).to.be.eq(mockedRequestResponse[7])
    expect(error!.httpStatusCode).to.be.eq(500)
    expect(error!.metadata).to.be.eq(mockedRequestResponse)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if balance is insuficient to place order', async () => {

    // preparing data
    const affiliateCode = 'affiliateCode'

    const message = 'not enough balance to place order for xxx'

    const throwedError = new AlunaError({
      code: AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE,
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
    const exchange = new BitfinexAuthed({
      credentials,
      settings: { affiliateCode },
    })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.place(commonOrderParams))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE)
    expect(error!.message).to.be.eq(message)
    expect(error!.httpStatusCode).to.be.eq(400)

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.callCount).to.be.eq(1)

    expect(parse.callCount).to.be.eq(0)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
