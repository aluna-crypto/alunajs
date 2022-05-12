import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Poloniex } from '../../../Poloniex'
import { PoloniexHttp } from '../../../PoloniexHttp'
import { getPoloniexEndpoints } from '../../../poloniexSpecs'
import { POLONIEX_RAW_SYMBOLS } from '../../../test/fixtures/poloniexSymbols'



describe(__filename, () => {

  it('should list Poloniex raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: PoloniexHttp.prototype })

    publicRequest.returns(Promise.resolve(POLONIEX_RAW_SYMBOLS))


    // executing
    const exchange = new Poloniex({})

    const {
      rawSymbols,
      requestWeight,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(POLONIEX_RAW_SYMBOLS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getPoloniexEndpoints(exchange.settings).symbol.list(''),
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
