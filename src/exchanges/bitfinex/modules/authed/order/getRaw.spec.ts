import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaOrderTypesEnum } from '../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaOrderErrorCodes } from '../../../../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderGetParams } from '../../../../../lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get a Bitfinex raw order just fine (open)', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.returns(Promise.resolve([mockedRawOrder]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = mockedRawOrder

    const { rawOrder } = await exchange.order.getRaw({
      id: id.toString(),
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).order.get(symbolPair),
      body: {
        id: [id],
        limit: 1,
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should get a Bitfinex raw order just fine (not-open)', async () => {

    // preparing data
    const mockedRawOrder = BITFINEX_RAW_ORDERS[0]


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve([]))
    authedRequest.onSecondCall().returns(Promise.resolve([mockedRawOrder]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const [
      id,
      _gid,
      _cid,
      symbolPair,
    ] = mockedRawOrder

    const { rawOrder } = await exchange.order.getRaw({
      id: id.toString(),
      symbolPair,
      type: AlunaOrderTypesEnum.LIMIT,
    })


    // validating
    expect(rawOrder).to.deep.eq(mockedRawOrder)

    expect(authedRequest.callCount).to.be.eq(2)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).order.get(symbolPair),
      body: {
        id: [id],
        limit: 1,
      },
    })
    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      credentials,
      url: getBitfinexEndpoints(exchange.settings).order.getHistory(symbolPair),
      body: {
        id: [id],
        limit: 1,
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if order is not found', async () => {

    // preparing data

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    authedRequest.onFirstCall().returns(Promise.resolve([]))
    authedRequest.onSecondCall().returns(Promise.resolve([]))


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const params: IAlunaOrderGetParams = {
      id: '',
      symbolPair: '',
      type: AlunaOrderTypesEnum.LIMIT,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.order.getRaw(params))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq('Order was not found.')

    expect(authedRequest.callCount).to.be.eq(2)

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
