import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bitmex } from '../../../Bitmex'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_SYMBOLS } from '../../../test/fixtures/bitmexSymbols'



describe(__filename, () => {

  it('should list Bitmex raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    publicRequest.returns(Promise.resolve(BITMEX_RAW_SYMBOLS))


    // executing
    const exchange = new Bitmex({})

    const {
      rawSymbols,
      requestWeight,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(BITMEX_RAW_SYMBOLS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBitmexEndpoints(exchange.settings).symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
