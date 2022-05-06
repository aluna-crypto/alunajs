import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { VALR_RAW_ORDERS } from '../../../test/fixtures/valrOrders'
import { VALR_RAW_CURRENCY_PAIRS } from '../../../test/fixtures/valrMarket'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Valr raw orders just fine', async () => {

    // preparing data
    const mockedRawOrders = VALR_RAW_ORDERS
    const mockedRawPairs = VALR_RAW_CURRENCY_PAIRS

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawOrders))
    publicRequest.returns(Promise.resolve(mockedRawPairs))

    // executing
    const exchange = new ValrAuthed({ credentials })

    const { rawOrders } = await exchange.order.listRaw()


    // validating
    expect(rawOrders).to.deep.eq({
      orders: mockedRawOrders,
      pairs: mockedRawPairs,
    })

    expect(authedRequest.callCount).to.be.eq(1)

    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      credentials,
      url: valrEndpoints.order.list,
    })

    expect(publicRequest.callCount).to.be.eq(1)

  })

})
