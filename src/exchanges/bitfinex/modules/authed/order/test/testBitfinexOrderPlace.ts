import { expect } from 'chai'

import { PARSED_ORDERS } from '../../../../../../../test/fixtures/parsedOrders'
import { mockHttp } from '../../../../../../../test/mocks/exchange/Http'
import { mockParse } from '../../../../../../../test/mocks/exchange/modules/mockParse'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderPlaceParams } from '../../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockEnsureOrderIsSupported } from '../../../../../../utils/orders/ensureOrderIsSupported.mock'
import { placeOrderParamsSchema } from '../../../../../../utils/validation/schemas/placeOrderParamsSchema'
import { mockValidateParams } from '../../../../../../utils/validation/validateParams.mock'
import { BitfinexAuthed } from '../../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../../BitfinexHttp'
import {
  bitfinexBaseSpecs,
  bitfinexEndpoints,
} from '../../../../bitfinexSpecs'
import { translateOrderSideToBitfinex } from '../../../../enums/adapters/bitfinexOrderSideAdapter'
import { translateOrderTypeToBitfinex } from '../../../../enums/adapters/bitfinexOrderTypeAdapter'
import { BITFINEX_PLACE_ORDER_RESPONSE } from '../../../../test/fixtures/bitfinexOrders'
import * as parseMod from '../parse'



const credentials: IAlunaCredentialsSchema = {
  key: 'key',
  secret: 'secret',
}



export const testBitfinexOrderPlace = (params: IAlunaOrderPlaceParams) => {

  const {
    account,
    type,
    side,
  } = params


  it(`should place a Bitfinex ${side} ${account} ${type} order just fine`, async () => {

    // preparing data
    const mockedParsedOrder = PARSED_ORDERS[0]
    const mockedRequestResponse = BITFINEX_PLACE_ORDER_RESPONSE


    // mocking
    const {
      authedRequest,
      publicRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRequestResponse))

    const { validateParamsMock } = mockValidateParams()

    const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ order: mockedParsedOrder })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { order } = await exchange.order.place(params)


    // validating
    const body = getExpectedRequestBody(params)

    expect(order).to.deep.eq(mockedParsedOrder)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      url: bitfinexEndpoints.order.place,
      credentials,
      body,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawOrder: mockedRequestResponse[4][0],
    })

    expect(validateParamsMock.callCount).to.be.eq(1)
    expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
      params,
      schema: placeOrderParamsSchema,
    })

    expect(ensureOrderIsSupported.callCount).to.be.eq(1)
    expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
      exchangeSpecs: exchange.specs,
      orderPlaceParams: params,
    })

  })

}



const getExpectedRequestBody = (
  params: IAlunaOrderPlaceParams,
): Record<any, any> => {

  const {
    account,
    type,
    side,
    amount,
    rate,
    symbolPair,
    limitRate,
    stopRate,
  } = params

  const translatedOrderType = translateOrderTypeToBitfinex({
    from: type,
    account,
  })

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

  const { affiliateCode } = bitfinexBaseSpecs.settings

  const body = {
    amount: translatedAmount,
    symbol: symbolPair,
    type: translatedOrderType,
    ...(price ? { price } : {}),
    ...(priceAuxLimit ? { price_aux_limit: priceAuxLimit } : {}),
    ...(affiliateCode ? { meta: { aff_code: affiliateCode } } : {}),
  }

  return body

}
