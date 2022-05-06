import { expect } from 'chai'

import { cloneDeep } from 'lodash'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { VALR_RAW_ORDERS } from '../../../test/fixtures/valrOrders'
import { VALR_RAW_CURRENCY_PAIRS } from '../../../test/fixtures/valrMarket'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Valr raw order just fine', async () => {

    // preparing data
    const mockedRawOrder = VALR_RAW_ORDERS[0]

    const mockedRawPairs = cloneDeep(VALR_RAW_CURRENCY_PAIRS)[0]

    mockedRawPairs.symbol = mockedRawOrder.currencyPair

    const { orderId: id } = mockedRawOrder


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrder))
    publicRequest.returns(Promise.resolve([mockedRawPairs]))


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { rawOrder } = await exchange.order.getRaw({
      id,
      symbolPair: '',
    })


    // validating
    expect(rawOrder).to.deep.eq({
      order: mockedRawOrder,
      pair: mockedRawPairs,
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: valrEndpoints.order.get(id, ''),
    })

    expect(publicRequest.callCount).to.be.eq(1)

  })

  it('should throw an error when a currency pair is not found', async () => {

    // preparing data
    const mockedRawOrder = VALR_RAW_ORDERS[0]

    const mockedRawPairs = cloneDeep(VALR_RAW_CURRENCY_PAIRS)[0]

    const { orderId: id, currencyPair } = mockedRawOrder

    const expectedMessage = `No symbol pair found for ${mockedRawOrder.currencyPair}`
    const expectedCode = AlunaGenericErrorCodes.PARSER_ERROR

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrder))
    publicRequest.returns(Promise.resolve([mockedRawPairs]))


    // executing
    const exchange = new ValrAuthed({ credentials })

    const { error } = await executeAndCatch(() => exchange.order.getRaw({
      id,
      symbolPair: currencyPair,
    }))


    // validating
    expect(error instanceof AlunaError).to.be.ok
    expect(error?.message).to.be.eq(expectedMessage)
    expect(error?.code).to.be.eq(expectedCode)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: valrEndpoints.order.get(id, currencyPair),
    })

    expect(publicRequest.callCount).to.be.eq(1)

  })

})
