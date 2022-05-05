import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Valr } from '../../../Valr'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'
import { VALR_RAW_SYMBOLS } from '../../../test/fixtures/valrSymbols'



describe(__filename, () => {

  it('should list Valr raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: ValrHttp.prototype })

    publicRequest.returns(Promise.resolve(VALR_RAW_SYMBOLS))


    // executing
    const exchange = new Valr({})

    const {
      rawSymbols,
      requestCount,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(VALR_RAW_SYMBOLS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: valrEndpoints.symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
