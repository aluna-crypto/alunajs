import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bittrex } from '../../../Bittrex'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { BITTREX_RAW_SYMBOLS } from '../../../test/fixtures/bittrexSymbols'



describe(__filename, () => {

  it('should list Bittrex raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    publicRequest.returns(Promise.resolve(BITTREX_RAW_SYMBOLS))


    // executing
    const exchange = new Bittrex({})

    const {
      rawSymbols,
      requestCount,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(BITTREX_RAW_SYMBOLS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBittrexEndpoints(exchange.settings).symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
