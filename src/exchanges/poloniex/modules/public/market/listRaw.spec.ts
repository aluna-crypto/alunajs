import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Poloniex } from '../../../Poloniex'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_RAW_MARKETS } from '../../../test/fixtures/poloniexMarket'



describe(__filename, () => {

  it('should list Poloniex raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    publicRequest.returns(Promise.resolve(POLONIEX_RAW_MARKETS))


    // executing
    const exchange = new Poloniex({})

    const {
      rawMarkets,
      requestWeight,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(POLONIEX_RAW_MARKETS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getPoloniexEndpoints(exchange.settings).market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
