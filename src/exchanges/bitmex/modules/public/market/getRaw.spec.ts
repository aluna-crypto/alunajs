import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bitmex } from '../../../Bitmex'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_MARKETS } from '../../../test/fixtures/bitmexMarket'



describe(__filename, () => {

  it('should get Bitmex raw market just fine', async () => {

    // preparing data
    const mockedRawMarket = BITMEX_RAW_MARKETS[0]
    const { symbol } = mockedRawMarket


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    publicRequest.returns(Promise.resolve([mockedRawMarket]))


    // executing
    const exchange = new Bitmex({})

    const {
      rawMarket,
      requestWeight,
    } = await exchange.market.getRaw!({ symbolPair: symbol })


    // validating
    expect(rawMarket).to.deep.eq(mockedRawMarket)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBitmexEndpoints(exchange.settings).market.get(symbol),
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
